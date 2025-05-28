import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { LocalStorageKeys, getItem, setItem, removeItem } from '../utils/localStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Check initial auth status

  useEffect(() => {
    const token = getItem<string>(LocalStorageKeys.ADMIN_TOKEN);
    if (token) {
      // In a real app, you might validate the token here
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    setItem(LocalStorageKeys.ADMIN_TOKEN, token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeItem(LocalStorageKeys.ADMIN_TOKEN);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    // Optional: return a global loading spinner or null
    return null; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
