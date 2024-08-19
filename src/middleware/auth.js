const jwt = require("jsonwebtoken");
const blackList = require("../models/blackList");

require("dotenv").config();
const secret_key = process.env.JWT_SECRETKEY;

const auth = async (req,res,next)=>{
  const header = req.headers.authorization;
  if(!header){
    return res.status(401).json({message:"token is invalid"})
  }

  const token = header.split(" ")[2];

  // you are one giving the expires

  const blackListCheck = await blackList.findOne({token:token});

  if(blackListCheck){
    return res.json({message:"this token is blacklisted try to login again"});

  };

  let decode = jwt.verify(token,secret_key,(err,result)=>{
    if(err){
      console.log(err);
      return res.status(400).json({message:err});
    }else{
      console.log(result);
      req.user = {email:result.email};
      next();
    }
  });

};

module.exports = auth;