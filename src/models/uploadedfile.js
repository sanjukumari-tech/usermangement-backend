const {Schema,model}= require("mongoose");

const uploadSchema = new Schema({

});


const uplodedFile= model("uploadedFile",uploadSchema);

module.exports = uplodedFile;