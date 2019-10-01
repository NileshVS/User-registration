const express = require('express');
const router = express.Router();
const register = require('../mongodb/registration');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');

//add new user
router.post('/newuser', async (req,res) => {
    let {error} = Validation(req.body);
    if(error){
        return res.status(404).send(error.details[0].message);
    }
    else{
        let emailValidation = await register.userModel.findOne({"userLogin.email": req.body.userLogin.email});
        if(emailValidation){
            return res.status(402).send('{message: "Email ID already exists"}')
        }
        let data = register.userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userId: req.body.userId,
            userLogin: req.body.userLogin
        });

        let salt = await bcrypt.genSalt(10);
        data.userLogin.password = await bcrypt.hash(data.userLogin.password, salt);
        let saved = await data.save();
        let token = saved.userIdentity();
        return res.header('x-auth-token', token).send({ message: `Thank you ${data.firstName} for registration`, data: saved});
    }
});
//view all users
router.get('/view-users' , async (req,res) => {
    let data = await register.userModel.find().select(['-userLogin']);
    return res.send(data);
})
//joi validation function
async function Validation(para){
    let schema = Joi.object({
        firstName: Joi.string().min(3).max(150).required(),
        lastName: Joi.string().min(3).max(150).required(),
        userId: Joi.string().required().min(3).max(150),
        userLogin: {
            email: Joi.string().min(3).max(150).required(),
            password: Joi.string().min(3).max(150).required()
        }
    });

    return schema.validate(para);
}

//exports
module.exports = router;