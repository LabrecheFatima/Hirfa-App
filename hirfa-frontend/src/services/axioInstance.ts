import axios from 'axios';
import keycloak from '../config/keycloak'; // Adjust path if your keycloak config is elsewhere

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8085/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Check keycloak token first, then fallback to localStorage
    const token = keycloak?.token || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;