const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/users');
const auth = require('../middleware/authentication')
const router = new express.Router();


router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const validOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!validOperation){
        return res.status(400).send({error: 'Invalid update!'});
    }

    try {

        //Commented out and refactored code. It was By Passing Midleware/Pre-Hooks for Bcrypt pwd Hash
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        //Updated Logic to Update Value(s) in User Schema
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        });
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e);
    }
});


//Endpoint Handler, allows for User to delete their account. Attempt to delete the User by id. 
// 1. Handle success 2. Handle user not found 3. Handle error
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    }catch(e){
        res.status(500).send();
    }
});


router.post('/users', async (req, res) => {
    const user = new User(req.body);
    
    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findUserByCredential(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        //Changed behavior. Method explicitly called to remove Password and Tokens from returned values. 
        res.send({user: user.getPublicProfile, token});
    } catch (e){
        res.status(400).send();
    }
});

//User able to logout of a specific session.  
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            //Return true when token currently looking at isn't used for authentication.
            return token.token !== req.token;
        });
        await req.user.save();
    }catch (e){
        res.status(500).send()
    }
});

//User logs out on all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch (e){
        res.status(500).send()
    }
});

//Repurposed to let individual obtain their own profile.
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});


router.get('/users/:id', async (req, res) => {
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
});

//Setup Endpoint for Avatar Upload and Creation
const upload = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 1000000 //Restrict Users Upload to 1 megabyte = 1,000,000 byte
    },
    fileFilter(req, file, cb){
        if (!file.original.name.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be an image: jpg, jpeg, png.'))
        } // conditional (!file.originalname.endsWith('.pdf'))
        
        cb(undefined, true)
    }
});
router.post('/users/me/avatar', auth, upload.single("avatar"), async (req, res) => {
    //Passed data to sharp and sharp sent it back converting image to png format and resizing format: Used to normalize all images.
    //Now we must change code req.user.avatar = req.file.buffer to req.user.avatar = buffer
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png.toBuffer() 

    //By commenting/removing dest: 'avatar' options object. Multer library wont save images to avatar directory it will pass data through the function for access.
    req.user.avatar = buffer; 
    await req.user.save(); //Need async and await to save the req the file.
    res.send(); 
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
});

//Route Endpoint to Delete avatar.
router.delete('/uses/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

//Route Enpoint to serve the file/avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        //Check if no user or no user avatar. If true throw error. 
        if(!user || !user.avatar){
            throw new Error()
        }
        //Set a response header for the content type. Confident image type will be png as we have reformated images using sharp.
        res.set('Content-Type', 'images/png');
        res.send(user.avatar);
    } catch (e){
        res.status(404).send();
    }
});

module.exports = router;