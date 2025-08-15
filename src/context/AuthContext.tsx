
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getUserProfile } from '@/services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is already logged in (from localStorage) and validate the token
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          if (parsedUser && parsedUser.token) {
            // Set the user immediately to avoid a flash of unauthenticated content
            setUser(parsedUser);
            setIsAdmin(parsedUser.role === 'admin');
            
            // Verify the token is still valid by making a request to the profile endpoint
            try {
              // This will throw an error if the token is invalid (handled by axios interceptor)
              await getUserProfile();
              // Token is valid, we already set the user above
            } catch (err) {
              // Token is invalid, remove from localStorage
              console.log('Session expired, please login again');
              localStorage.removeItem('user');
              setUser(null);
              setIsAdmin(false);
            }
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Auth check error:', err);
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await apiLogin({ email, password });
      
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await apiRegister({ name, email, password });
      
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw new Error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
