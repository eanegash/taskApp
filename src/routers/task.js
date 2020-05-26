const express = require('express');
const Task = require('../models/tasks');
const auth = require('../middleware/authentication');
const router = new express.Router();


router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const validOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!validOperation){
        return res.status(400).send({error: 'Invalid update!'});
    }

    try { 
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        //const task = await Task.findById(req.params.id);
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        
        if (!task) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save()
        
        res.send(user)
    } catch (e) {
        res.status(400).send(e);
    }
});


//Endpoint Handler, allows for removal of Tasks. Attempt to delete the Task by id. 
// 1. Handle success 2. Handle task not found 3. Handle error
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if (!task){
            return res.status(404).send();
        }
        res.send(user);
    }catch(e){
        res.status(500).send();
    }
});

//Create a Task and associate it to the authenticated User (Logged in Owner).
router.post('/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks').execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(400).send(e);
    }
});

//Task returnable to only Owner of the Task.
router.get('/tasks/:id', auth, async (req, res) => {
    const idTask = req.params.id;
    try {
        const task = await Task.findOne({idTask, owner: req.user._id});
        if (!task){
            return res.status(404).send();
        }
        res.send(task)
    } catch(e) {
        res.status(500).send(e);
    }
});

//Completed: Have or haven't been completed. Action URL condition based (parameter). ---- GET /tasks?completed=...
//Pagination: Limit number of returned tasks... options...limit:parseInt(...) ---- GET /tasks?limit=10
//Skip: Number of returned tasks ---- GET /tasks?limit=10$skip=20
//Sorting: GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    //Empty object for sorting/match customization
    const match = {}
    const sort = {}
    //Completed Logic. 
    if (req.query.completed) {
        //Shorthand used req.query is True then set completed to True.
        match.completed = req.query.completed === 'true'
    }
    
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        //Ternary operator used to initiaze sort variable.
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 
    }
    
    try {
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit), //Use URL value instead of Hardcode
                skip: parseInt(req.query.skip), //Skip {skip} records then get the next {limit} records.
                sort: {
                    createdAt: -1 //Desc -1, Asc 1
                }
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send();
    }
});


module.exports = router;