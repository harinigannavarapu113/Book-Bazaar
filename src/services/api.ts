import api from './axiosConfig';

// Auth services
export const login = async (userData: { email: string; password: string }) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

export const register = async (userData: { name: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const registerAdmin = async (adminData: { 
  name: string; 
  email: string; 
  password: string;
  businessName?: string;
  businessDescription?: string;
}) => {
  const response = await api.post('/users/register-admin', adminData);
  return response.data;
};

// User services
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (userData: { 
  name?: string; 
  email?: string; 
  password?: string 
}) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get('/users/stats');
  return response.data;
};

// Book services
export const getBooks = async (params = {}) => {
  const response = await api.get('/books', { params });
  return response.data;
};

export const getBook = async (id: string) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const getBookById = async (id: string) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (bookData: FormData) => {
  const response = await api.post('/books', bookData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateBook = async (id: string, bookData: FormData) => {
  const response = await api.put(`/books/${id}`, bookData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteBook = async (id: string) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

// Order services
export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await api.get('/orders/user');
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get('/orders/admin');
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await api.put(`/orders/${orderId}`, { status });
  return response.data;
};

// Other services
export const getCategories = async () => {
  const response = await api.get('/books/categories');
  return response.data;
};
