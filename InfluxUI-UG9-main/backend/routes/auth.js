// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { login, customLogin } = require('../controllers/authController');

// define the login route
router.post('/login', login);               // Define the default login route
router.post('/custom-login', customLogin);  // Define the custom login route

module.exports = router;