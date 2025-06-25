import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, LoginData, RegisterData } from '../types/auth';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const handleAuthResponse = (response: any) => {
    if (!response.data?.user) {
      throw new Error('Invalid authentication response');
    }
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  const login = async (data: LoginData) => {
    try {
      const response = await apiService.login(data);
      handleAuthResponse(response);
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiService.register(data);
      handleAuthResponse(response);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 