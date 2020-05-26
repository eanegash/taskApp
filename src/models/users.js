require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

//
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, process.env.DB_TOKEN);

    user.tokens = user.tokens.concat({token});
    await user.save();
    return token
}

//
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

const User = mongoose.model('User', userSchema);

module.exports = User;

//With Middleware: new request -> do something -> run route handler