
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';

const AdminHeader = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const adminRoutes = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/books', label: 'Manage Books' },
    { path: '/admin/orders', label: 'Manage Orders' },
    { path: '/admin/users', label: 'Manage Users' },
    { path: '/admin/profile', label: 'Profile Settings' },
  ];

  const getCurrentPageName = () => {
    const currentRoute = adminRoutes.find(route => route.path === location.pathname);
    return currentRoute?.label || 'Admin Dashboard';
  };

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {getCurrentPageName()}
          </h1>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Navigate To
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {adminRoutes.map((route) => (
                  <DropdownMenuItem key={route.path} asChild>
                    <Link 
                      to={route.path}
                      className="w-full cursor-pointer"
                    >
                      {route.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem>
                  <Link to="/" className="w-full cursor-pointer">
                    Back to Store
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600"
                  onClick={logout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
