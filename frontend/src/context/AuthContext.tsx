import { createContext } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const DUMMY_ADMIN: User = {
  id: 1,
  username: 'Admin',
  email: 'admin@example.com',
  role: 'admin',
  created_at: new Date().toISOString()
};

export const AuthContext = createContext<AuthContextType>({
  user: DUMMY_ADMIN,
  token: 'dummy-token',
  login: () => {},
  logout: () => {},
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContext.Provider value={{ 
      user: DUMMY_ADMIN, 
      token: 'dummy-token', 
      login: () => {}, 
      logout: () => {}, 
      isLoading: false 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
