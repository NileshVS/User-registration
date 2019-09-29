const express = require('express');
const app = express();
const mongoose = require('mongoose');
const route = require('./routes/registration.routes')
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('tiny'));
app.use('/register-api', route);

app.listen(4000, () => console.log("Server is running at 4000 :)"));

mongoose.connect('mongodb://localhost/registration', {useNewUrlParser: true, useUnifiedTopology:true})
.then(() => console.log('connected to DB'))
.catch((err) => console.log('DB connect failed' ,err.message));

