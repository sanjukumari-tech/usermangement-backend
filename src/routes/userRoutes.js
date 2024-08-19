// routes/userRoutes.js
const express = require('express');
const blackList = require('../models/blackList');

const { createRegister, createLogin, createLogout } = require('../controllers/userRouteController');

const userRoutes = express.Router();

// Register
userRoutes.post('/register',createRegister );

// Login
userRoutes.post('/login', createLogin);

// Logout
userRoutes.get('/logout', createLogout);

module.exports = userRoutes;
