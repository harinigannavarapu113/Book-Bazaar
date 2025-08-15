
const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  deleteUser, 
  getUserStats,
  registerAdmin
} = require('../controllers/user.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register-admin', registerAdmin);

// Protected routes (require authentication)
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);

// Admin routes
router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);
router.get('/stats', verifyToken, verifyAdmin, getUserStats);

module.exports = router;
