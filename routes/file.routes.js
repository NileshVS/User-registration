const express = require('express');
const router = express.Router();
const multer = require('multer/');
const F = require('../mongodb/fileMongo');

let portNo = 'localhost:4000'; 
let storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './uploads/');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
});

const filefilter = (req,file,cb) =>{
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
};

let upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: filefilter
})
.single('image');

router.post('/fileupload', upload, async (req,res) => {
    let data = await F.fileModel({
        image: portNo + '/uploads/' + req.file.filename
    });

    if(!data){
        res.send('File upload unsuccessful');
    }
    else{
        let uploadLink = await data.save();
        res.send(uploadLink);
    }
})

module.exports=router;