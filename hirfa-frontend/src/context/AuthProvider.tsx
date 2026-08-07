import React, { useEffect, useState, useRef, type ReactNode } from 'react';
import keycloak from '../config/keycloak';
import type { Role, User } from '../types';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  
  // Guard flag against double execution in React StrictMode
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(auth);
        if (auth) {
          const realmRoles = keycloak.realmAccess?.roles || [];
          setRoles(realmRoles);

          const parsedToken = keycloak.tokenParsed;
          setUser({
            id: parsedToken?.sub || '',
            email: parsedToken?.email,
            firstName: parsedToken?.given_name,
            lastName: parsedToken?.family_name,
          });
        }
      })
      .catch((err) => {
        console.error('Keycloak initialization failed:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  const hasRole = (role: Role): boolean => {
    return roles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        loading,
        user,
        roles,
        login,
        logout,
        hasRole,
        token: keycloak.token,
      }}
    >
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};