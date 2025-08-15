const Order = require('../models/order.model');
const Book = require('../models/book.model');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { books, address, phone } = req.body;
    const userId = req.user._id;
    
    if (!books || books.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    
    // Calculate order amount and verify book availability
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of books) {
      const book = await Book.findById(item.bookId);
      
      if (!book) {
        return res.status(404).json({ message: `Book with ID ${item.bookId} not found` });
      }
      
      if (book.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${book.title}` });
      }
      
      // Calculate item price
      const itemPrice = book.price * item.quantity;
      totalAmount += itemPrice;
      
      // Add to order items with price
      orderItems.push({
        bookId: item.bookId,
        quantity: item.quantity,
        price: book.price
      });
      
      // Update book stock
      book.stock -= item.quantity;
      await book.save();
    }
    
    // Create order
    const order = await Order.create({
      userId,
      books: orderItems,
      amount: totalAmount,
      address,
      phone
    });
    
    // Populate book details for response
    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: 'books.bookId',
        select: 'title author image'
      })
      .populate({
        path: 'userId',
        select: 'name email'
      });
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    const orders = await Order.find({ userId: req.user._id })
      .populate({
        path: 'books.bookId',
        select: 'title author image'
      })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate({
        path: 'books.bookId',
        select: 'title author image'
      })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Handle cancelled orders - restock items
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.books) {
        const book = await Book.findById(item.bookId);
        if (book) {
          book.stock += item.quantity;
          await book.save();
        }
      }
    }
    
    order.status = status;
    const updatedOrder = await order.save();
    
    // Return populated data for the UI
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate({
        path: 'books.bookId',
        select: 'title author image'
      });
    
    res.json(populatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order by ID (for admin or order owner)
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate({
        path: 'books.bookId',
        select: 'title author image'
      });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the user is admin or the order owner
    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById
};




/*old code

const Order = require('../models/order.model');
const Book = require('../models/book.model');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { books, address, phone } = req.body;
    const userId = req.user._id;
    
    if (!books || books.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    
    // Calculate order amount and verify book availability
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of books) {
      const book = await Book.findById(item.bookId);
      
      if (!book) {
        return res.status(404).json({ message: `Book with ID ${item.bookId} not found` });
      }
      
      if (book.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${book.title}` });
      }
      
      // Calculate item price
      const itemPrice = book.price * item.quantity;
      totalAmount += itemPrice;
      
      // Add to order items with price
      orderItems.push({
        bookId: item.bookId,
        quantity: item.quantity,
        price: book.price
      });
      
      // Update book stock
      book.stock -= item.quantity;
      await book.save();
    }
    
    // Create order
    const order = await Order.create({
      userId,
      books: orderItems,
      amount: totalAmount,
      address,
      phone
    });
    
    // Populate book details for response
    const populatedOrder = await Order.findById(order._id).populate({
      path: 'books.bookId',
      select: 'title author image'
    });
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate({
        path: 'books.bookId',
        select: 'title author image'
      })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate({
        path: 'books.bookId',
        select: 'title author image'
      })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Handle cancelled orders - restock items
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.books) {
        const book = await Book.findById(item.bookId);
        if (book) {
          book.stock += item.quantity;
          await book.save();
        }
      }
    }
    
    order.status = status;
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};
*/