// routes/userRoutes.js
const express = require('express');
const blackList = require('../models/blackList');
const bcrypt = require("bcrypt");
const User = require('../models/UserModel');
// const blackList = require('../models/blackList');
const jwt = require("jsonwebtoken");

// const blackList = require('../models/blackList');
require('dotenv').config();

const secret_key = process.env.JWT_SECRETKEY;

// Register
const createRegister =  async (req, res) => {
  const { username, email, password, profilePic } = req.body;

  try{
    const check = await User.findOne({email:req.body.email});

    if(check){
        return res.status(400).json({message:"this email is already existed.. try with another mail"})
    }

    //if you are here mean new user with diff mail and need to register and hash the password and also generate token 
    bcrypt.hash(password,5,async(err,hash)=>{
        if(err) console.log(err);
        const user = await User.create({
            username:username,
            email:email,
            password: hash,
        });
        res.status(201).json({message:"user is registered successfully"})
    })

  }catch(err){
    console.log(err);
    res.status(500).json({message:"Internal error has ocurred..."})
  }

};

// Login
const createLogin = async (req, res) => {
    const {  email, password } = req.body;
  
    try{
        //first check is user email is present or not
        const check = await User.findOne({email:req.body.email});

        if(!check){
            console.log("this email not registered . Please register it")
            return res.status(400).json({message:"this email not registered . Please register it "});
        }

        // here now checking hash password if match we will provide jwt token 
        bcrypt.compare(password,check.password,(err,result)=>{
            if(err) console.log(err);
            const payload = {email:check.email};
            if(result){//true //means hashed password matched with the new one
                const access_token = jwt.sign(payload,secret_key);
                const refresh_token = jwt.sign(payload,secret_key,{expiresIn:"10min"},);

                res.json({access_token,refresh_token});

            }else{
                console.log("password is incorrect");
                return res.status(400).json({message:"password is incorrect try to again to login"})
            }
        })
  
    }catch(err){
      console.log(err);
      res.status(500).json({message:"Internal error has ocurred..."})
    }
  
  };

// Logout
const createLogout =async (req, res) => {
    
  
    try{
        const header = req.headers.authorization;
        if(!header){
            return res.json({message:"token header is not present"});
        }
        const token = header.split(" ")[1];
        const blackListt = await blackList.create({token});

        res.status(200).json({message:"you have logged out"})
  
    }catch(err){
      console.log(err);
      res.status(500).json({message:"Internal error has ocurred..."})
    }
  
  };
module.exports = {createRegister,createLogin,createLogout};
