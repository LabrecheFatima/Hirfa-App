import axios from 'axios';
import keycloak from '../config/keycloak';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated && keycloak.token) {
      // Refresh token automatically if expiring in under 30 seconds
      try {
        await keycloak.updateToken(30);
      } catch (error) {
        console.error('Failed to refresh Keycloak token', error);
      }
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

