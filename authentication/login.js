const express = require('express');
const router = express.Router();
const bcrypt= require('bcrypt');
const Joi = require('@hapi/joi');
const registerModel = require('../mongodb/registration');
const authMiddleware = require('../middleware/authenticate');
const adminMiddleware = require('../middleware/isAdmin');

router.get('/userlogin', async (req,res) => {
    let {error} = Validation(req.body);
    if (error){
        return res.status(402).send(error.details[0].message);
    }
    else{
        let email= await registerModel.userModel.findOne({"userLogin.email": req.body.userLogin.email});
        if(!email){ return res.status(402).send('Email ID not found')};
        let password=await bcrypt.compare(req.body.userLogin.password, email.userLogin.password);
        if(!password){ return res.status(402).send('Invalid Password')};
        let token= email.userIdentity();
        return res.header('x-auth-token', token).send('User logged in successfully');
    }
});

router.delete('/deleteuser/:id',[authMiddleware, adminMiddleware], async (req,res) => {
    let del = await registerModel.userModel.findByIdAndRemove(req.params.id);
    console.log(del);
    if(!del){
        res.send('No matching ID found');
    }
    else{
        res.send({msg: `User ID ${req.params.id} removed`});
    }
});

async function Validation(para){
    let schema = Joi.object().keys({
        userLogin:{
            email: Joi.string().required().min(3).max(150),
            password: Joi.string().required().min(3).max(150)
        }
    });
    return schema.validate(para);
}

module.exports=router;