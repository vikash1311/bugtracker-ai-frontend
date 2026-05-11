import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://bugtracker-ai.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for cold start
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
