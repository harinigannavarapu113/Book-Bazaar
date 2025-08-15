
const express = require('express');
const router = express.Router();
const { 
  getAllBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook,
  getCategories
} = require('../controllers/book.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Public routes
router.get('/', getAllBooks);
router.get('/categories', getCategories);
router.get('/:id', getBookById);

// Admin routes
router.post('/', verifyToken, verifyAdmin, upload.single('image'), createBook);
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), updateBook);
router.delete('/:id', verifyToken, verifyAdmin, deleteBook);

module.exports = router;
