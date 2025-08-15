
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface OrderBook {
  bookId: {
    _id: string;
    title: string;
    author: string;
    image: string;
  };
  quantity: number;
  price: number;
}

interface OrderData {
  _id: string;
  books: OrderBook[];
  address: string;
  phone: string;
  amount: number;
  status: string;
  createdAt: string;
}

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as OrderData;
  
  useEffect(() => {
    // Redirect to home if no order data was passed
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);
  
  if (!order) {
    return null; // Will redirect due to the useEffect
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="text-green-500 mb-4">
            <CheckCircle className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h2 className="text-lg font-medium">Order #{order._id.substring(0, 8)}</h2>
                <p className="text-gray-600 text-sm">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-gray-900 font-medium mb-2">Items</h3>
              <div className="border rounded-md overflow-hidden">
                {order.books.map((item) => (
                  <div key={item.bookId._id} className="flex items-center p-4 border-b last:border-b-0">
                    <div className="h-16 w-12 flex-shrink-0">
                      <img
                        src={item.bookId.image.startsWith('http') 
                          ? item.bookId.image 
                          : `http://localhost:5000/uploads/${item.bookId.image}`
                        }
                        alt={item.bookId.title}
                        className="h-full w-full object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/48x64?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium">{item.bookId.title}</h4>
                      <p className="text-sm text-gray-600">by {item.bookId.author}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${item.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-900 font-medium mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-line">{order.address}</p>
                  <p className="mt-2">
                    <span className="font-medium">Phone:</span> {order.phone}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-900 font-medium mb-2">Order Summary</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${order.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold border-t border-gray-200 mt-2 pt-2">
                    <span>Total</span>
                    <span>${order.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8">
              <Button variant="outline" asChild className="mb-4 sm:mb-0">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              
              <Button asChild>
                <Link to="/profile">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  View All Orders
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
