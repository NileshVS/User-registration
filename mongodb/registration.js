const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    firstName: {type:String, required:true, min:3,max:250},
    lastName: {type:String, required:true, min:3,max:250},
    userLogin: {
        email: {type: String, required:true, min:3,max:100},
        password: {type: String, required:true}
    }
});

let userModel = new mongoose.model('users', userSchema);

module.exports= {userSchema,userModel};