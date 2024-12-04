import api from '../utils/axios';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Interceptor to add the token to the Authorization header
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
