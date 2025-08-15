
# BookStore - MERN Stack Online Bookstore

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Environment Setup
1. Make sure MongoDB Atlas is properly configured with the connection string in `.env` file
2. The JWT secret should be set in the `.env` file

### Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
npm install
```

### Seed the Database
```bash
# Run the seed script to populate the database with sample data
node server/utils/seedData.js
```

### Running the Application
```bash
# Start the backend server
npm run server

# In a separate terminal, start the frontend
npm run dev
```

## Demo Credentials
- Admin Account:
  - Email: admin@bookstore.com
  - Password: admin123

- Customer Account:
  - Email: john@example.com
  - Password: password123

## Features
- Full-featured shopping cart
- Product reviews and ratings
- User profile with orders
- Admin product management
- Admin user management
- Admin Order details page
- Checkout process (shipping, payment method, etc)
- Database seeder (products & users)

## Project Structure
- `/src` - Frontend (React)
- `/server` - Backend (Express)
  - `/controllers` - Route controllers
  - `/models` - MongoDB models
  - `/routes` - API routes
  - `/middlewares` - Express middlewares
  - `/utils` - Utility functions

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login

### Books
- GET /api/books - Get all books (with filters)
- GET /api/books/:id - Get single book by ID
- POST /api/books - Create a new book (admin only)
- PUT /api/books/:id - Update a book (admin only)
- DELETE /api/books/:id - Delete a book (admin only)

### Orders
- POST /api/orders - Create a new order
- GET /api/orders/user - Get logged in user orders
- GET /api/orders/admin - Get all orders (admin only)
- PUT /api/orders/:id - Update order status (admin only)

### Users
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- GET /api/users - Get all users (admin only)
- DELETE /api/users/:id - Delete user (admin only)
