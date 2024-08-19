// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String },
  eventsRegistered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
