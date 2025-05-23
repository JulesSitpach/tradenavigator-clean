import { z } from 'zod';
import { getApiUrl } from './apiUtils';

// Token storage key for localStorage
export const TOKEN_STORAGE_KEY = "trade_navigator_token";

// Basic login schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Registration schema with password confirmation
export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  companyName: z.string().min(2, 'Company name is required'),
  industry: z.string().optional(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// Helper functions for authentication
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function isTokenValid(): boolean {
  const token = getToken();
  if (!token) return false;
  
  // In a real app, you would check token expiration
  // This is a simple placeholder implementation
  return true;
}

// API implementation
export async function login(data: LoginInput): Promise<any> {
  try {
    console.log("Attempting direct login with:", data);
    const apiUrl = getApiUrl('/api/auth/login');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log("Login response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const responseText = await response.text();
    console.log("Response text:", responseText);
    
    const responseData = JSON.parse(responseText);
    setToken(responseData.token);
    return responseData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function register(data: RegisterInput): Promise<any> {
  try {
    const apiUrl = getApiUrl('/api/auth/register');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const responseData = await response.json();
    setToken(responseData.token);
    return responseData;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    const apiUrl = getApiUrl('/api/auth/logout');
    
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeToken();
  }
}

export async function getProfile(): Promise<any> {
  try {
    const token = getToken();
    if (!token) return null;

    const apiUrl = getApiUrl('/api/auth/profile');
    console.log("API request to /api/auth/profile", { method: "GET" });
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
        return null;
      }
      throw new Error('Failed to fetch profile');
    }

    const responseText = await response.text();
    console.log("API response text length:", responseText.length);
    return JSON.parse(responseText);
  } catch (error) {
    console.log("Catch to API request error:", error);
    console.error('Profile fetch error:', error);
    return null;
  }
}
