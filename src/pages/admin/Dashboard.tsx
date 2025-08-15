
import React, { useState, useEffect } from 'react';
import { getUserStats } from '@/services/api';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  DollarSign,
  Calendar,
  Book,
  Settings,
  Menu,
  LayoutDashboard,
  Home
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import Loader from '@/components/ui/Loader';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserStats();
      
      // Format monthly data for charts
      const formattedMonthlyData = data.monthlyOrders && data.monthlyOrders.length > 0 
        ? data.monthlyOrders.map((item: any) => {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
              name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
              orders: item.count,
              revenue: parseFloat(item.revenue.toFixed(2))
            };
          })
        : [{ name: 'No Data', orders: 0, revenue: 0 }];
      
      // Format category data for pie chart
      const formattedCategoryData = data.categoryStats && data.categoryStats.length > 0 
        ? data.categoryStats.map((item: any) => ({
            name: item._id || 'Uncategorized',
            value: item.count
          }))
        : [{ name: 'No Data', value: 1 }];
      
      setStats({
        ...data,
        formattedMonthlyData,
        formattedCategoryData
      });
      
      toast.success("Dashboard data loaded successfully");
    } catch (err: any) {
      console.error("Error fetching stats:", err);
      setError(err.message || 'Failed to load dashboard data');
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <Loader message="Loading dashboard data..." />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-medium">Error loading dashboard</p>
          <p>{error || 'Failed to load dashboard data'}</p>
        </div>
        <Button onClick={fetchStats} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/admin/books" className="flex items-center cursor-pointer">
                    <Book className="mr-2 h-4 w-4" />
                    <span>Manage Books</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/orders" className="flex items-center cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Manage Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/users" className="flex items-center cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Manage Users</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/profile" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Back to Store</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Registered customers</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">Across all customers</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(stats.totalRevenue || 0).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time revenue</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentOrders?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Last 5 customer orders</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
              <CardDescription>
                Number of orders and revenue by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.formattedMonthlyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Book Categories</CardTitle>
              <CardDescription>
                Distribution of books by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.formattedCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.formattedCategoryData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value} books`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Orders */}
        <Card className="hover:shadow-md transition-shadow mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                The latest 5 orders across your bookstore
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchStats}>
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-3 font-medium">Order ID</th>
                      <th className="text-left pb-3 font-medium">Customer</th>
                      <th className="text-left pb-3 font-medium">Amount</th>
                      <th className="text-left pb-3 font-medium">Status</th>
                      <th className="text-left pb-3 font-medium">Date</th>
                      <th className="text-right pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order: any) => (
                      <tr key={order._id} className="border-b hover:bg-muted/50">
                        <td className="py-3 pr-2">
                          {order._id.substring(0, 8)}...
                        </td>
                        <td className="py-3 pr-2">
                          {order.userId && order.userId.name ? order.userId.name : 'Unknown Customer'}
                        </td>
                        <td className="py-3 pr-2">
                          ${order.amount.toFixed(2)}
                        </td>
                        <td className="py-3 pr-2">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right">
                          <Link to={`/admin/orders`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No recent orders available
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/books">
            <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Books</CardTitle>
                <Book className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Add, edit and manage your book inventory</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/orders">
            <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Orders</CardTitle>
                <Package className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">View and update customer orders</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/users">
            <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Users</CardTitle>
                <Users className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">View and manage user accounts</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
