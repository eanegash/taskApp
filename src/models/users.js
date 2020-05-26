require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./tasks');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase.includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

//Virtual: Used to create an associate between foreign and local fields.
//IN SQL relational database foreign and primary keys. In MongoDB a virtual DB.
//Relationship is not being built into DB , virtual relationship.
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

//Returning Public Profile and manipulating what is exposed to the User.
userSchema.methods.getPublicProfile = function(){
    const user = this;

    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;

    return userObj;
}

//Methods on the individual user
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id: user._id.toString()}, process.env.DB_TOKEN);

    user.tokens = user.tokens.concat({token});
    await user.save();
    return token
}

//Methods on the actual User model
userSchema.statics.findUserByCredential = async (email, password) => {
    const user = await User.findOne({email: email});
    if (!user) {
        throw new Error('Unable to LogIn')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error('Unable to LogIn')
    }

    return user
}

//Middleware (pre or post Hooks) Hash user password before saving.
userSchema.pre('save', async function(next){
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }

    next();
});

//Cascade and Delete User Tasks when User Account Deleted/Remove
userSchema.pre('remove', async function (next){
    const user = this;

    await Task.deleteMany({owner: user._id})

    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;

//With Middleware: new request -> do something -> run route handler