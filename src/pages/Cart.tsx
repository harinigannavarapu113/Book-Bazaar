
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';


const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to continue to checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link
            to="/books"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-4">Book</th>
                <th className="text-right pb-4 hidden sm:table-cell">Price</th>
                <th className="text-center pb-4">Quantity</th>
                <th className="text-right pb-4">Subtotal</th>
                <th className="text-right pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} className="border-b py-4">
                  <td className="py-4">
                    <div className="flex items-center">
                      <img
                        src={item.image.startsWith('http') 
                          ? item.image 
                          : `http://localhost:5000/uploads/${item.image}`
                        }
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded mr-4 hidden sm:block"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/80x100?text=No+Image';
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">by {item.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right hidden sm:table-cell">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="bg-gray-200 text-gray-800 w-8 h-8 rounded-l"
                      >
                        -
                      </button>
                      <span className="bg-gray-100 w-10 h-8 flex items-center justify-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="bg-gray-200 text-gray-800 w-8 h-8 rounded-r"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-4 text-right font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <div className="flex space-x-2">
                <button
                  onClick={clearCart}
                  className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded"
                >
                  Clear Cart
                </button>
                <Link
                  to="/books"
                  className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 md:pl-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-medium text-lg"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
