
const User = require('../models/user.model');
const Order = require('../models/order.model');
const Book = require('../models/book.model');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if new email already exists (if changing email)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    
    // If password is provided, it will be hashed automatically by the pre-save middleware
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }
    
    await user.deleteOne();
    
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user stats for admin dashboard
const getUserStats = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    // Get total orders and calculate revenue from non-cancelled orders
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    
    // Get monthly orders data for charts
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    
    const monthlyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $group: {
          _id: { 
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Get category stats
    const categoryStats = await Book.aggregate([
      { 
        $group: { 
          _id: { $ifNull: ['$category', 'Uncategorized'] }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);
    
    // Get recent orders with populated user data
    const recentOrders = await Order.find({})
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: revenue,
      monthlyOrders,
      categoryStats,
      recentOrders
    });
  } catch (error) {
    console.error("Error in getUserStats:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register admin (for sellers)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, businessName, businessDescription } = req.body;
    
    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Create new admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      businessName: businessName || `${name}'s Bookstore`,
      businessDescription: businessDescription || 'Independent book seller',
      isApproved: true // Setting to true for now to make testing easier, in production would be false
    });
    
    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        businessName: admin.businessName,
        isApproved: admin.isApproved,
        message: 'Admin account created successfully! You can now log in.'
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  getUserStats,
  registerAdmin
};
