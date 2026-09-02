import Keycloak from 'keycloak-js';
import { api } from '../services/api';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'hirfa-realm',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'hirfa-frontend',
});

keycloak.onAuthSuccess = () => {
  if (keycloak.token) {
    localStorage.setItem('kc_token', keycloak.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
  }
};

keycloak.onTokenExpired = () => {
  keycloak.updateToken(30).then((refreshed) => {
    if (refreshed && keycloak.token) {
      localStorage.setItem('kc_token', keycloak.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
    }
  }).catch(() => {
    localStorage.removeItem('kc_token');
  });
};

export default keycloak;