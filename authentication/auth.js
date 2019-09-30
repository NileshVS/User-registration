const express = require('express');
const router = express.Router();
const bcrypt= require('bcrypt');
const Joi = require('@hapi/joi');
const registerModel = require('../mongodb/registration');

router.get('/auth', async (req,res) => {
    let {error} = Validation(req.body);
    if (error){
        return res.status(402).send(error.details[0].message);
    }
    else{
        let email= await registerModel.userModel.findOne({"userLogin.email": req.body.userLogin.email});
        if(!email){ return res.status(402).send('Email ID not found')};
        let password=await bcrypt.compare(req.body.userLogin.password, email.userLogin.password);
        if(!password){ return res.status(402).send('Invalid Password')};
        return res.send('User Authenticated');
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