import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from "../providers/AuthProvider";
import MainLayout from './layouts/MainLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Only redirect when we're sure the user is not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      navigate('auth/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    // Show loading indicator while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated and not loading, don't render anything
  // The useEffect will handle redirection
  if (!isAuthenticated) {
    return null;
  }

  // Render children wrapped in MainLayout if authenticated
  return <MainLayout>{children}</MainLayout>;
}



