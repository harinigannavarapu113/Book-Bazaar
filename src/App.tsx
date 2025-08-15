
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PrivateRoute from '@/components/auth/PrivateRoute';
import AdminHeader from '@/components/admin/AdminHeader';

// Public Pages
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerRegistration from './pages/SellerRegistration';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminBooksList from './pages/admin/BooksList';
import BookForm from './pages/admin/BookForm';
import AdminOrdersList from './pages/admin/OrdersList';
import AdminUsersList from './pages/admin/UsersList';

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster position="bottom-right" />
            <Sonner 
              position="bottom-right" 
              closeButton={false}
              duration={4000} 
            />
            
            <div className="flex flex-col min-h-screen">
              <Navbar />
              {isAdminRoute && <AdminHeader />}
              
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/books" element={<BookList />} />
                  <Route path="/books/:id" element={<BookDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  } />
                  <Route path="/order-success" element={
                    <PrivateRoute>
                      <OrderSuccess />
                    </PrivateRoute>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/register-seller" element={<SellerRegistration />} />
                  <Route path="/profile" element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={
                    <PrivateRoute adminOnly>
                      <AdminDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/books" element={
                    <PrivateRoute adminOnly>
                      <AdminBooksList />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/books/add" element={
                    <PrivateRoute adminOnly>
                      <BookForm />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/books/edit/:id" element={
                    <PrivateRoute adminOnly>
                      <BookForm />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <PrivateRoute adminOnly>
                      <AdminOrdersList />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/users" element={
                    <PrivateRoute adminOnly>
                      <AdminUsersList />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/profile" element={
                    <PrivateRoute adminOnly>
                      <Profile />
                    </PrivateRoute>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              
              <Footer />
            </div>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
