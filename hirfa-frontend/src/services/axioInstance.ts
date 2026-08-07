import axios from 'axios';
import keycloak from '../config/keycloak';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8085',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      try {
        // Refresh token if it expires in less than 30 seconds
        await keycloak.updateToken(30);
      } catch (error) {
        console.error('Failed to refresh Keycloak token', error);
        keycloak.login();
      }
      
      if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;