
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/services/api';
import Loader from '@/components/ui/Loader';


interface CheckoutFormData {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();

  if (!user) {
    navigate('/login', { state: { from: '/checkout' } });
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setLoading(true);
      
      // Format address for the API
      const formattedAddress = `${data.address}, ${data.city}, ${data.postalCode}, ${data.country}`;
      
      // Prepare order data
      const orderData = {
        books: cartItems.map(item => ({
          bookId: item._id,
          quantity: item.quantity
        })),
        address: formattedAddress,
        phone: data.phone
      };
      
      // Create order
      const response = await createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Show success message
      alert('Order placed successfully!');
      
      // Navigate to order success page with order details
      navigate('/order-success', { state: { order: response } });
      
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
      
      {loading && <Loader fullPage />}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Street address"
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    className={`w-full p-2 border rounded ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="City"
                    {...register('city', { required: 'City is required' })}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    className={`w-full p-2 border rounded ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Postal Code"
                    {...register('postalCode', { required: 'Postal code is required' })}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="country" className="block text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  id="country"
                  className={`w-full p-2 border rounded ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Country"
                  {...register('country', { required: 'Country is required' })}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Phone number"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9+-]+$/,
                      message: 'Invalid phone number format'
                    }
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
              
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <p className="text-gray-600 mb-4">
                  This is a simulation - no real payment will be processed.
                </p>
                
                <div className="p-4 bg-gray-50 rounded border border-gray-200 mb-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="payment-method"
                      name="payment-method"
                      checked
                      readOnly
                      className="mr-2"
                    />
                    <label htmlFor="payment-method" className="text-gray-700">
                      Credit Card (Simulation)
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-medium text-lg"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="max-h-64 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex py-2 border-b">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.image.startsWith('http') 
                        ? item.image 
                        : `http://localhost:5000/uploads/${item.image}`
                      }
                      alt={item.title}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/80x100?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-2">
                <span className="text-lg font-medium">Total</span>
                <span className="text-lg font-bold text-blue-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
