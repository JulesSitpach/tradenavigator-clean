import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from "../providers/AuthProvider";

// Import all pages - UPDATED PATHS
import Dashboard from '../pages/dashboard';
import CostAnalysis from '../pages/dashboard/cost-analysis';
import CostBreakdown from '../pages/cost-breakdown';
import RouteAnalysis from '../pages/dashboard/route-analysis';
import TariffAnalysis from '../pages/dashboard/tariff-analysis';
import Regulations from '../pages/regulations';
import RegulationsDetailed from '../pages/regulations-detailed';
import RegulationsExemptions from '../pages/regulations-exemptions';
import RegulationsMenu from '../pages/regulations-menu';
import SpecialPrograms from '../pages/special-programs';
import DutyDrawback from '../pages/duty-drawback';
import Profile from '../pages/settings/profile';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import NotFound from '../pages/not-found';
import Markets from '../pages/markets';
import MarketsAnalysis from '../pages/markets-analysis';
import MarketsPartners from '../pages/markets-partners';
import AIGuidance from '../pages/ai-guidance';
import AIPredictions from '../pages/ai-predictions';
import Visualizations from '../pages/visualizations';
import TradeZones from '../pages/trade-zones';
import Overview from '../pages/dashboard/overview';
import PricingPage from '../pages/pricing';
import NavigationTest from '../pages/navigation-test';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

// Auth route (redirects to dashboard if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Main Router component
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/auth/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/auth/register" element={<AuthRoute><Register /></AuthRoute>} />
        
        {/* Navigation test route */}
        <Route path="/navigation-test" element={<NavigationTest />} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
        <Route path="/overview" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/cost-analysis" element={<ProtectedRoute><CostAnalysis /></ProtectedRoute>} />
        <Route path="/route-analysis" element={<ProtectedRoute><RouteAnalysis /></ProtectedRoute>} />
        <Route path="/tariff-analysis" element={<ProtectedRoute><TariffAnalysis /></ProtectedRoute>} />
        
        {/* Regulations routes */}
        <Route path="/regulations-menu" element={<ProtectedRoute><RegulationsMenu /></ProtectedRoute>} />
        <Route path="/regulations" element={<ProtectedRoute><Regulations /></ProtectedRoute>} />
        <Route path="/regulations-detailed" element={<ProtectedRoute><RegulationsDetailed /></ProtectedRoute>} />
        <Route path="/regulations-exemptions" element={<ProtectedRoute><RegulationsExemptions /></ProtectedRoute>} />
        
        {/* Other protected routes */}
        <Route path="/special-programs" element={<ProtectedRoute><SpecialPrograms /></ProtectedRoute>} />
        <Route path="/duty-drawback" element={<ProtectedRoute><DutyDrawback /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/markets" element={<ProtectedRoute><Markets /></ProtectedRoute>} />
        <Route path="/markets/analysis" element={<ProtectedRoute><MarketsAnalysis /></ProtectedRoute>} />
        <Route path="/markets/partners" element={<ProtectedRoute><MarketsPartners /></ProtectedRoute>} />
        <Route path="/cost-breakdown" element={<ProtectedRoute><CostBreakdown /></ProtectedRoute>} />
        <Route path="/ai-guidance" element={<ProtectedRoute><AIGuidance /></ProtectedRoute>} />
        <Route path="/ai-predictions" element={<ProtectedRoute><AIPredictions /></ProtectedRoute>} />
        <Route path="/visualizations" element={<ProtectedRoute><Visualizations /></ProtectedRoute>} />
        <Route path="/trade-zones" element={<ProtectedRoute><TradeZones /></ProtectedRoute>} />
        
        {/* Pricing route */}
        <Route path="/pricing" element={<PricingPage />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
