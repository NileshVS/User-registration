const express = require('express');
const app = express();
const mongoose = require('mongoose');
const register = require('./routes/registration.routes');
const login=require('./authentication/login');
const morgan = require('morgan');
const config=require('config');
const fileUpload= require('./routes/file.routes');

app.use(express.json());
app.use(morgan('tiny'));
app.use('/uploads',express.static('uploads'));
app.use('/avatars',express.static('avatars'));
app.use('/api', [register, login, fileUpload]);

app.listen(4000, () => console.log("Server is running at 4000 :)"));

let configKey = config.get('jwtKey');
if(!configKey){
    console.log('jwtKey is not set');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/registration', {useNewUrlParser: true, useUnifiedTopology:true})
.then(() => console.log('connected to DB'))
.catch((err) => console.log('DB connect failed' ,err.message));

