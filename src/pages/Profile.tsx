
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, updateUserProfile, getUserOrders } from '@/services/api';
import { Loader2, UserIcon, Package, ShoppingBag, Eye, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from '@/components/ui/Loader';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [orders, setOrders] = useState([]);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user profile
        const profileData = await getUserProfile();
        setProfileForm({
          name: profileData.name || '',
          email: profileData.email || '',
          password: '',
          confirmPassword: ''
        });
        
        // Fetch user orders
        const ordersData = await getUserOrders();
        setOrders(ordersData);
      } catch (err: any) {
        console.error('Failed to fetch user data:', err);
        setError(err.message || 'Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match if provided
    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      setUpdating(true);
      setError(null);
      
      const updateData: {
        name: string;
        email: string;
        password?: string;
      } = {
        name: profileForm.name,
        email: profileForm.email
      };
      
      // Only include password if it was provided
      if (profileForm.password) {
        updateData.password = profileForm.password;
      }
      
      await updateUserProfile(updateData);
      
      // Clear password fields
      setProfileForm(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      
      toast.success('Profile updated successfully');
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const openOrderModal = (order: any) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile">
              <UserIcon className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and password
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-md font-medium mb-2">Change Password</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Leave blank to keep your current password
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="password">New Password</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={profileForm.password}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={profileForm.confirmPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button type="submit" disabled={updating}>
                      {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {isAdmin && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Admin Dashboard</CardTitle>
                  <CardDescription>
                    Manage your bookstore as an admin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Access the admin dashboard to manage books, orders, and users.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => navigate('/admin/dashboard')}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Go to Admin Dashboard
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View and track your orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-1">No orders yet</h3>
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                    <Button onClick={() => navigate('/books')}>Start Shopping</Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order: any) => (
                      <div key={order._id} className="border rounded-md overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h4 className="font-medium">Order #{order._id.substring(0, 8)}...</h4>
                              <p className="text-sm text-gray-500">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="mt-2 sm:mt-0 flex items-center">
                              <span className={`inline-block px-2 py-1 text-xs rounded-full mr-4 ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <span className="font-medium">${order.amount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                        <div className="space-y-3">
  {order.books?.map((item: any) => (
    item?.bookId && (
      <div key={item.bookId._id} className="flex items-center">
        <div className="h-16 w-12 flex-shrink-0">
          <img
            src={item.bookId.image?.startsWith('http') 
              ? item.bookId.image 
              : item.bookId.image 
                ? `http://localhost:5000/uploads/${item.bookId.image}`
                : 'https://placehold.co/48x64?text=No+Image'
            }
            alt={item.bookId.title || 'No Title'}
            className="h-full w-full object-cover rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/48x64?text=No+Image';
            }}
          />
        </div>
      </div>
    )
  ))}
</div>

                          
                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              <p>Shipping to: {order.address.substring(0, 30)}...</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => openOrderModal(order)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Order
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Detail Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              Order Details
              <DialogClose className="h-4 w-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogTitle>
            {selectedOrder && (
              <DialogDescription>
                Order #{selectedOrder._id.substring(0, 8)}...
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Status:</span>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="border-t border-b py-3">
                <h3 className="font-medium mb-2">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.books.map((item: any) => (
                    <div key={item.bookId._id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-12 w-10 mr-3">
                          <img
                            src={item.bookId.image?.startsWith('http') 
                              ? item.bookId.image 
                              : `http://localhost:5000/uploads/${item.bookId.image}`
                            }
                            alt={item.bookId.title}
                            className="h-full w-full object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://placehold.co/40x48?text=No+Image';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.bookId.title}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b pb-3">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-sm">{selectedOrder.address}</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>${selectedOrder.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
