const mongoose = require('mongoose');

let fileSchema = new mongoose.Schema({
    image: {type:String, required: true}
})

let fileModel = new mongoose.model('file', fileSchema);

module.exports={fileSchema,fileModel};