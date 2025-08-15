
import React from 'react';
import { 
  LayoutDashboard, 
  Book, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  Home
} from 'lucide-react';

export type AdminNavItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  onClick?: () => void;
};

export const createAdminNavItems = (
  currentPath: string, 
  logoutHandler: () => void
): AdminNavItem[] => {
  return [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      title: 'Manage Books',
      icon: Book,
      path: '/admin/books',
    },
    {
      title: 'Manage Orders',
      icon: Package,
      path: '/admin/orders',
    },
    {
      title: 'Manage Users',
      icon: Users,
      path: '/admin/users',
    },
    {
      title: 'Profile Settings',
      icon: Settings,
      path: '/admin/profile',
    },
    {
      title: 'Back to Store',
      icon: Home,
      path: '/',
    },
    {
      title: 'Logout',
      icon: LogOut,
      path: '#',
      onClick: logoutHandler
    }
  ];
};
