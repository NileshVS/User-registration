const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const mailer = require('nodemailer');
const R = require('../mongodb/registration');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');

router.post('/resetmail', async (req,res) => {
    let {error} = Validation(req.body);
    if(error){ res.send(error.details[0].message);}
    let email = await R.userModel.findOne({"userLogin.email": req.body.userLogin.email});
    if(!email) {res.send('Email does not exist');}
    let token = crypto.randomBytes(10).toString('hex');
    email.resetPasswordToken = token;
    email.resetTokenExpires = Date.now() + 3600000; //1 hour
    let data = await email.save();

    let transporter = mailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'kathleen.durgan72@ethereal.email', //ethereal id
            pass: 'zdSAMWPSxH6a5tDx6s' //ethereal password
        }
    });

    let mailOptions= {
        from: 'NodeMailer reset password test',
        to: req.body.userLogin.email,
        subject:'Reset Password',
        text: 'Please click the following link to reset your password: localhost:4000/api/resetpassword/' + token
    }
    transporter.sendMail(mailOptions, (err) => {
        console.log(err.message);
    });

    res.send('Please check your Email ID to proceed with resetting password');
});

async function Validation(para){
    let schema = Joi.object({
        userLogin: {
            password: Joi.string().min(3).max(150).required()
        }
    });

    return schema.validate(para);
}

router.post('/resetpassword/:token', async (req,res) => {
    let receivedToken = req.params.token;
    let checkToken= await R.userModel.findOne({ resetPasswordToken :receivedToken , resetTokenExpires: {$gt: Date.now()}});
    if(!checkToken) { res.send('Something went wrong :(');}
    let checkPassword= await bcrypt.compare(checkToken.userLogin.password, req.body.userLogin.password);
    if(checkPassword){ res.send('Please provide a different password')};
    let salt = await bcrypt.genSalt(10);
    let newPassword =await bcrypt.hash(req.body.userLogin.password, salt);
    checkToken.userLogin.password = newPassword;
    checkToken.resetPasswordToken = null;
    checkToken.resetTokenExpires = null;
    await checkToken.save();
    res.send({msg: 'Password updated successfully'});
});

module.exports = router;