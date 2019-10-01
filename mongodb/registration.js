const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config= require('config');

let userSchema = new mongoose.Schema({
    firstName: {type:String, required:true, min:3,max:250},
    lastName: {type:String, required:true, min:3,max:250},
    userId:{type:String, required:true, min:3, max:150},
    avatar: {type:String},
    userLogin: {
        email: {type: String, required:true, min:3,max:100},
        password: {type: String, required:true}
    },
    isAdmin:{type:Boolean}
});

userSchema.methods.userIdentity = function() {
    let token= jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtKey'));
    return token;
};

let userModel = new mongoose.model('users', userSchema);

module.exports= {userSchema,userModel};