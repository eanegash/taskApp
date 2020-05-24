const express = requires('express');
const User = require('../models/users');
const router = new express.Router();


router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
//    user.save().then(() => { 
 //       res.send(user);
 //   }).catch((e) => {
//        res.status(400).send(e);
//    });
});

router.get('/users', (req, res) =>{
    try {
        const users = await User.find({});
        res.send(users)
    } catch (e) {
        res.status(500).send(e);
    }
//    User.find({}).then((users) => {
//        res.send(users);
//    }).catch((e) => {
//        res.status(500).send(e);
//    });
});


router.get('/users/:id', (req, res) => {
    const idUser = req.params.id;
    try {
        const user = await User.findById({idUser});
        if (!user){
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
//    User.findById({idUser}).then((users) => {
//        if (!user) {
//            return res.status(404).send();
//        }
//        res.send(user);
//    }).catch((e) => {
//        res.status(500).send(e);
//    });
});


router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const validOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!validOperation){
        return res.status(400).send({error: 'Invalid update!'});
    }

    try {
         const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
         if (!user) {
             return res.status(404).send()
         }
         res.send(user)
    } catch (e) {
        res.status(400).send(e);
    }
});

//Endpoint Handler, allows for removal of Users. Attempt to delete the User by id. 
// 1. Handle success 2. Handle user not found 3. Handle error
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(e){
        res.status(500).send();
    }
});

module.exports = router;