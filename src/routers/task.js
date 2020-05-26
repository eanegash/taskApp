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

//Create a Task and associate it to th authenticated User (Logged in Owner).
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


router.get('/tasks', async (req, res) => {
    try {
        const task = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
});


module.exports = router;