
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  session: any | null; // Added session property
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>; // Added signUp method
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null); // Added session state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an authenticated session
    const checkAuth = async () => {
      try {
        // For demo purposes, let's simulate a logged-in user and session
        const mockUser = {
          id: '123',
          name: 'Demo User',
          email: 'demo@example.com'
        };
        
        const mockSession = {
          access_token: 'mock-token-123',
          user: mockUser
        };
        
        setUser(mockUser);
        setSession(mockSession);
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = {
        id: '123',
        name: 'Demo User',
        email
      };
      
      const mockSession = {
        access_token: 'mock-token-123',
        user: mockUser
      };
      
      setUser(mockUser);
      setSession(mockSession);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, we would create a user here
      // For now, we'll just return success and not log the user in automatically
      console.log('User registered successfully:', email);
      // Clear any existing session
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Simulate sign out
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    signUp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
