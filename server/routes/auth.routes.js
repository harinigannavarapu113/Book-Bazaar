const express = require('express');
const router = express.Router();
const { register, login, createAdmin, getUserProfile } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get user profile (protected route)
router.get('/profile', verifyToken, getUserProfile);

// Create admin account (protected in production)
router.post('/admin', createAdmin);

module.exports = router;