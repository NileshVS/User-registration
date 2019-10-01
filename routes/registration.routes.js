const express = require('express');
const router = express.Router();
const register = require('../mongodb/registration');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const multer = require('multer');

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
            avatar: 'undefined',
            userLogin: req.body.userLogin
        });

        let salt = await bcrypt.genSalt(10);
        data.userLogin.password = await bcrypt.hash(data.userLogin.password, salt);
        let saved = await data.save();
        return res.send({ message: `Thank you ${data.userId} for registration`, data: saved});
    }
});

//file upload
let storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './avatars/');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
});

const filefilter = (req, file,cb) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

let upload= multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: filefilter
}).single('avatar');


router.post('/newuseravatar/:id', upload, async (req,res) => {
    let portNo = 'localhost:4000';
    let idAvatar = await register.userModel.findByIdAndUpdate(req.params.id, { avatar: portNo + '/avatars/' + req.file.filename});
    // console.log(idAvatar);
    if(!idAvatar){ res.send('ID not found')};
    res.send({msg: "Image uploaded", path: idAvatar.avatar});
});


//view all users
router.get('/view-users' ,async (req,res) => {
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