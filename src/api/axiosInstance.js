import axios from 'axios';

const BASE_URL = 'https://bugtracker-ai.onrender.com/api';

// Wake the backend silently before any login attempt
export const wakeBackend = async () => {
  try {
    await axios.get(`${BASE_URL}/auth/login`, { timeout: 30000 });
  } catch {
    // 405 Method Not Allowed = server is awake, ignore
  }
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
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