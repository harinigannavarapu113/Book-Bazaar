
const Book = require('../models/book.model');
const fs = require('fs');
const path = require('path');

// Get all books with filtering
const getAllBooks = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    let query = {};

    // Apply filters if provided
    if (category) {
      query.category = category;
    }

    if (minPrice && maxPrice) {
      query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    } else if (minPrice) {
      query.price = { $gte: parseFloat(minPrice) };
    } else if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new book (admin only)
const createBook = async (req, res) => {
  try {
    const { title, author, price, stock, description, category, imageUrl } = req.body;
    
    // Handle image (file upload or URL)
    let imagePath = 'default-book.jpg';
    
    if (req.file) {
      // If image is uploaded as file
      imagePath = req.file.filename;
    } else if (imageUrl) {
      // If image is provided as URL
      imagePath = imageUrl;
    }
    
    const book = await Book.create({
      title,
      author,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      category,
      image: imagePath
    });
    
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a book (admin only)
const updateBook = async (req, res) => {
  try {
    const { title, author, price, stock, description, category, imageUrl } = req.body;
    
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // If new image uploaded as file and old image is local file, delete old one
    if (req.file && book.image !== 'default-book.jpg' && !book.image.startsWith('http')) {
      try {
        const oldImagePath = path.join(__dirname, '../uploads', book.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (err) {
        console.error('Error deleting old image:', err);
      }
    }
    
    book.title = title || book.title;
    book.author = author || book.author;
    book.price = price ? parseFloat(price) : book.price;
    book.stock = stock ? parseInt(stock) : book.stock;
    book.description = description || book.description;
    book.category = category || book.category;
    
    // Update image based on what was provided
    if (req.file) {
      book.image = req.file.filename;
    } else if (imageUrl) {
      book.image = imageUrl;
    }
    
    const updatedBook = await book.save();
    
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a book (admin only)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Delete book image if not default and not an external URL
    if (book.image !== 'default-book.jpg' && !book.image.startsWith('http')) {
      try {
        const imagePath = path.join(__dirname, '../uploads', book.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }
    
    await book.deleteOne();
    
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get book categories
const getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getCategories
};
