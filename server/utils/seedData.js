
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Book = require('../models/book.model');

// Sample book data
const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 12.99,
    stock: 15,
    description: "A classic novel depicting the Jazz Age in the United States.",
    category: "Fiction",
    image: "default-book.jpg"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 14.99,
    stock: 20,
    description: "A novel about racial injustice and moral growth in the American South.",
    category: "Fiction",
    image: "default-book.jpg"
  },
  {
    title: "1984",
    author: "George Orwell",
    price: 11.99,
    stock: 12,
    description: "A dystopian novel describing a totalitarian regime and mass surveillance.",
    category: "Science Fiction",
    image: "default-book.jpg"
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 16.99,
    stock: 25,
    description: "A fantasy novel about the quest of Bilbo Baggins.",
    category: "Fantasy",
    image: "default-book.jpg"
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 9.99,
    stock: 18,
    description: "A romantic novel about the Bennet family, focusing on character development.",
    category: "Romance",
    image: "default-book.jpg"
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    price: 18.99,
    stock: 14,
    description: "A book about the history and evolution of humans.",
    category: "Non-Fiction",
    image: "default-book.jpg"
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 10.99,
    stock: 22,
    description: "A novel about teenage angst and alienation.",
    category: "Fiction",
    image: "default-book.jpg"
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    price: 13.99,
    stock: 30,
    description: "A mystery thriller novel about secret religious societies.",
    category: "Thriller",
    image: "default-book.jpg"
  }
];

// Sample user data
const users = [
  {
    name: "Admin User",
    email: "admin@bookstore.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user"
  }
];

// Function to seed database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('Cleared existing data');

    // Create users with hashed passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users
    await User.insertMany(hashedUsers);
    console.log('Users added successfully');

    // Insert books
    await Book.insertMany(books);
    console.log('Books added successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
