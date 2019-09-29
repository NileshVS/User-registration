const express = require('express');
const router = express.Router();
const register = require('../mongodb/registration');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');


router.post('/new-user', async (req,res) => {
    let {error} = Validation(req.body);
    if(error){
        return res.status(404).send(error.details[0].message);
    }
    else{
        let data = register.userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userLogin: req.body.userLogin
        });

        let salt = await bcrypt.genSalt(10);
        data.userLogin.password = await bcrypt.hash(data.userLogin.password, salt);
        let saved = await data.save();
        return res.send({ message: "Thank you for registration", data: saved});
    }
});

async function Validation(para){
    let schema = Joi.object({
        firstName: Joi.string().min(3).max(150).required(),
        lastName: Joi.string().min(3).max(150).required(),
        userLogin: {
            email: Joi.string().min(3).max(150).required(),
            password: Joi.string().min(3).max(150).required()
        }
    });

    return schema.validate(para);
}

module.exports = router;