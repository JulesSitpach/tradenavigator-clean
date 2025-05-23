import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, apiRequestJson } from '../lib/queryClient';

// Token storage key for local storage
const TOKEN_STORAGE_KEY = "trade_navigator_token";
const USER_STORAGE_KEY = "trade_navigator_user";

// Helper to set the authentication token in localStorage
const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

// Types for authentication
type User = {
  id: number;
  email: string;
  companyName: string;
  industry: string | null;
  subscriptionTier: string;
  subscriptionStatus: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  industry?: string;
};

interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface UserContext {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<AuthResponse>;
  register: (data: RegisterInput) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<UserContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Try to restore user data from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    
    if (savedUser && token) {
      try {
        // Parse and restore user data
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Validate token in background
        validateTokenSilently();
      } catch (error) {
        console.error('Error restoring user session:', error);
      }
    }
    
    // Always mark loading as complete
    setIsLoading(false);
  }, []);
  
  // Silently validate token without disrupting user experience
  const validateTokenSilently = async () => {
    try {
      const { data, error, status } = await apiRequestJson<User>('/api/auth/profile');
      
      if (data && !error) {
        // Update user data with fresh data from server
        setUser(data);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
      } else if (status === 401) {
        // Token is invalid, clear user data
        handleLogout();
      }
    } catch (error) {
      console.log('Token validation error:', error);
      // Don't log out the user on network errors
    }
  };

  const handleLogin = async (data: LoginInput): Promise<AuthResponse> => {
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Login failed');
      }

      // Parse the successful response
      const responseData: AuthResponse = await response.json();
      
      // Store user data and token
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(responseData.user));
      setAuthToken(responseData.token);
      setUser(responseData.user);
      
      return responseData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleRegister = async (data: RegisterInput): Promise<AuthResponse> => {
    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Registration failed');
      }

      // Parse the successful response
      const responseData: AuthResponse = await response.json();
      
      // Store user data and token
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(responseData.user));
      setAuthToken(responseData.token);
      setUser(responseData.user);
      
      return responseData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      // Try to call logout API if available
      await apiRequest('/api/auth/logout', {
        method: 'POST',
      }).catch(() => {
        // Ignore errors from logout endpoint
      });
    } finally {
      // Always clear local storage and state
      localStorage.removeItem(USER_STORAGE_KEY);
      setAuthToken(null);
      setUser(null);
    }
  };

  const value: UserContext = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
