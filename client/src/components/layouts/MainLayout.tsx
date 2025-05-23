import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../providers/AuthProvider";
import NavigationContainer from './NavigationContainer';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout component that provides a consistent layout for authenticated pages
 * Includes header, navigation, and main content area
 */
export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationContainer />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}

