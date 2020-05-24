const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
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
    }
});

const me = new User ({
    name: 'Andrew',
    email: 'andrew@gmail.com',
    password: 'test123'
});

me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log('Error', error);
});

module.exports = User;