
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/order.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

// User routes
router.post('/', verifyToken, createOrder);
router.get('/user', verifyToken, getUserOrders);

// Admin routes
router.get('/admin', verifyToken, verifyAdmin, getAllOrders);
router.put('/:id', verifyToken, verifyAdmin, updateOrderStatus);

module.exports = router;
