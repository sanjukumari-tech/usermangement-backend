const {Schema,model} = require("mongoose");

const blackListSchema = new Schema({
    token: {type:String, required:true}
});

const blackList = model("blackList",blackListSchema);

module.exports = blackList;