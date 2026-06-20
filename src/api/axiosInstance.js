import axios from 'axios';

const BASE_URL = 'https://bugtracker-ai.onrender.com/api';

// Wake the backend and report whether it's actually reachable
export const wakeBackend = async () => {
  try {
    await axios.get(`${BASE_URL}/auth/login`, { timeout: 45000 });
    return true; // unlikely path, server responded 200 to a GET
  } catch (err) {
    // Any response at all (even 404/403/405) means the server is awake
    // and answered — only a true network/timeout error means it's still asleep
    if (err.response) return true;
    return false;
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