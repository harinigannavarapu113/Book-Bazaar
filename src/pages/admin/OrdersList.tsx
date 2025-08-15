import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '@/services/api';
import { Search, Filter, RefreshCw, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from '@/components/ui/Loader';
import { toast } from "sonner";

interface OrderDetails {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  books: Array<{
    bookId: {
      _id: string;
      title: string;
      author: string;
      image: string;
    };
    quantity: number;
    price: number;
  }>;
  amount: number;
  address: string;
  phone: string;
  status: string;
  createdAt: string;
}

const statusColors: { [key: string]: string } = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const AdminOrdersList = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateSort, setDateSort] = useState('newest');
  const [error, setError] = useState<string | null>(null);
  
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, dateSort, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError(err.message || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...orders];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        (order.userId?.name && order.userId.name.toLowerCase().includes(term)) ||
        (order.userId?.email && order.userId.email.toLowerCase().includes(term)) ||
        order._id.toLowerCase().includes(term) ||
        order.books.some(item => 
          item.bookId?.title?.toLowerCase().includes(term) ||
          item.bookId?.author?.toLowerCase().includes(term)
        )
      );
    }
    
    if (statusFilter && statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredOrders(result);
  };

  const handleViewOrder = (order: OrderDetails) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOrderDetailsOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || newStatus === selectedOrder.status) return;
    
    try {
      setUpdatingStatus(true);
      await updateOrderStatus(selectedOrder._id, newStatus);
      
      const updatedOrders = orders.map(order => 
        order._id === selectedOrder._id ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Failed to update order status:', err);
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Select value={dateSort} onValueChange={setDateSort}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Sort by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={fetchOrders} size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" onClick={fetchOrders} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-gray-500">No orders found.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order._id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        {order.userId ? (
                          <div>
                            <div className="font-medium">{order.userId.name}</div>
                            <div className="text-sm text-gray-500">{order.userId.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Unknown User</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.books.length} {order.books.length === 1 ? 'item' : 'items'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${order.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order ID: {selectedOrder?._id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-sm mb-2">Customer Information</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p><span className="font-medium">Name:</span> {selectedOrder.userId?.name || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.userId?.email || 'N/A'}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.phone}</p>
                    <p><span className="font-medium">Address:</span> {selectedOrder.address}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Order Information</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${statusColors[selectedOrder.status] || 'bg-gray-100 text-gray-800'}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p><span className="font-medium">Total Amount:</span> ${selectedOrder.amount.toFixed(2)}</p>
                    <p><span className="font-medium">Items:</span> {selectedOrder.books.length}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Update Order Status</h4>
                    <div className="flex space-x-2">
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button onClick={handleUpdateStatus} disabled={updatingStatus || newStatus === selectedOrder.status}>
                        {updatingStatus ? <Loader /> : 'Update'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Order Items</h4>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.books.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center">
                              {item.bookId?.image && (
                                <img
                                  src={item.bookId.image.startsWith('http') 
                                    ? item.bookId.image 
                                    : `http://localhost:5000/uploads/${item.bookId.image}`
                                  }
                                  alt={item.bookId.title}
                                  className="w-10 h-12 object-cover rounded mr-3"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://placehold.co/40x48?text=No+Image';
                                  }}
                                />
                              )}
                              <div>
                                <div className="font-medium">{item.bookId?.title || 'Unknown Book'}</div>
                                <div className="text-sm text-gray-500">{item.bookId?.author || 'Unknown Author'}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOrderDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrdersList;
