// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const mongo_url= process.env.MONGO_URI;
const connectDB = async (url) => {
  try {
    await mongoose.connect(mongo_url);
    console.log('MongoDB connected');
  } catch (err) {
    console.log(err)
   
  }
};

module.exports = connectDB;
