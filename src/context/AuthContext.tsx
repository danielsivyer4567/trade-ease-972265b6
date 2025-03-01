
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage or session
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('tradeease-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Mock login for now
      setLoading(true);
      // In a real app, this would call an API
      const mockUser = {
        id: '1',
        email,
        name: 'Demo User',
        role: 'admin',
      };
      
      localStorage.setItem('tradeease-user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // Mock registration
      const mockUser = {
        id: '1',
        email,
        name,
        role: 'user',
      };
      
      localStorage.setItem('tradeease-user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('tradeease-user');
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    // Mock forgot password functionality
    console.log(`Password reset requested for: ${email}`);
    return Promise.resolve();
  };

  const resetPassword = async (token: string, newPassword: string) => {
    // Mock reset password functionality
    console.log(`Resetting password with token: ${token}`);
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      forgotPassword,
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
