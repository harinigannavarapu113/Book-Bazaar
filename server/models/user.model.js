const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'admin']
  },
  // For admin sellers
  businessName: {
    type: String,
    default: ''
  },
  businessDescription: {
    type: String,
    default: ''
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.role === 'user'; // Regular users are approved by default, admins need approval
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords - IMPORTANT: only implement one method to avoid confusion
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// For backward compatibility, implement comparePassword as an alias to matchPassword
userSchema.methods.comparePassword = async function(enteredPassword) {
  return this.matchPassword(enteredPassword);
};

module.exports = mongoose.model('User', userSchema);