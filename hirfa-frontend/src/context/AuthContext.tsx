import { createContext } from 'react';
import type { Role, User } from '../types';

export interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  user: User | null;
  roles: string[];
  login: () => void;
  register: () => void;
  logout: () => void;
  hasRole: (role: Role) => boolean;
  token: string | undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);