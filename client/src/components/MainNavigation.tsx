import React, { useState } from 'react';
import { useLocation } from 'wouter';
import CleanLink from './CleanLink';
import { Link } from 'wouter';
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";
import { useLanguage, LanguageSelector } from "../providers/LanguageProvider";
import { LucideMenu, LucideMoon, LucideSun, LucideX, LucideChevronDown } from 'lucide-react';

export default function MainNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [location] = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isActive = (path: string) => {
    return location === path ? 'text-primary font-medium' : 'text-foreground hover:text-primary';
  };

  // Clean up any URL before using it
  const cleanUrl = (url: string) => {
    return url.replace(/^[#/]+/, '').replace(/\/+/g, '/');
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          {/* Top navigation row */}
          <div className="py-3 border-b border-border">
            <nav className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <svg viewBox="0 0 24 24" width="24" height="24" className="text-primary">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="2" />
                    <path d="M9 16l3-8 3 8M9.75 14h4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="text-lg font-bold text-primary">TradeNavigator</span>
                </Link>
              </div>

              {/* Main Nav Links - Center */}
              <div className="hidden md:flex items-center justify-center space-x-6">
                <Link href="/" className={`text-sm ${isActive('/')}`}>
                  Features
                </Link>
                <Link href="/pricing" className={`text-sm ${isActive('/pricing')}`}>
                  Pricing
                </Link>
                <Link href="/dashboard" className={`text-sm ${isActive('/dashboard')}`}>
                  Dashboard
                </Link>
              </div>

              {/* Right Menu Items */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Language Selector */}
                <LanguageSelector />

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-muted"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <LucideSun size={18} /> : <LucideMoon size={18} />}
                </button>

                {/* User Menu */}
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-1 text-sm">
                      <span className="text-sm font-medium">Account</span>
                      <LucideChevronDown size={14} />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-muted">
                          Profile
                        </Link>
                        <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-muted">
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <Link
                      href="/auth/login"
                      className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Get started
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-muted"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isOpen ? <LucideX size={20} /> : <LucideMenu size={20} />}
              </button>
            </nav>
          </div>
          
          {/* Second navigation row - Tool categories (Only shown when user is logged in) */}
          {user && (
            <div className="hidden md:flex items-center space-x-6 py-2">
              <Link href="/" className={`text-sm ${isActive('/')}`}>
                {t('nav.overview')}
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm hover:text-primary">
                  <span>Tools</span>
                  <LucideChevronDown size={14} />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-card rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      href="/cost-analysis"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                    >
                      {t('nav.costAnalysis')}
                    </Link>
                    <Link
                      href="/route-analysis"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                    >
                      {t('nav.routeAnalysis')}
                    </Link>
                    <Link
                      href="/tariff-analysis"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                    >
                      {t('nav.tariffAnalysis')}
                    </Link>
                    <Link
                      href="/visualizations"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                    >
                      Visualizations
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm hover:text-primary">
                  <span>Regulations</span>
                  <LucideChevronDown size={14} />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-card rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <CleanLink
                      to="regulations"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                    >
                      Basic Regulations
                    </CleanLink>
                    <CleanLink
                      to="regulations-detailed"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                    >
                      Detailed Regulations
                    </CleanLink>
                    <CleanLink
                      to="regulations-exemptions"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                    >
                      Exemptions
                    </CleanLink>
                    <a 
                      href="#direct-nav-test" 
                      className="block px-4 py-2 text-sm hover:bg-muted bg-muted-foreground/10"
                    >
                      🔍 Navigation Test
                    </a>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm hover:text-primary">
                  <span>Markets</span>
                  <LucideChevronDown size={14} />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-card rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link href="/markets/basic" className="block px-4 py-2 text-sm hover:bg-muted">
                      Basic Market Information
                    </Link>
                    <Link href="/markets/analysis" className="block px-4 py-2 text-sm hover:bg-muted">
                      Market Analysis
                    </Link>
                    <Link href="/markets/trade-partners" className="block px-4 py-2 text-sm hover:bg-muted">
                      Trade Partner Recommendations
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm hover:text-primary">
                  <span>AI</span>
                  <LucideChevronDown size={14} />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-card rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link href="/ai/guidance" className="block px-4 py-2 text-sm hover:bg-muted">
                      Regulatory Guidance
                    </Link>
                    <Link href="/ai/predictions" className="block px-4 py-2 text-sm hover:bg-muted">
                      AI Predictions
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm hover:text-primary">
                  <span>Programs</span>
                  <LucideChevronDown size={14} />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-card rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link href="/programs/duty-drawback" className="block px-4 py-2 text-sm hover:bg-muted">
                      Duty Drawback
                    </Link>
                    <Link href="/programs/trade-zones" className="block px-4 py-2 text-sm hover:bg-muted">
                      Trade Zones
                    </Link>
                    <Link href="/programs/special-programs" className="block px-4 py-2 text-sm hover:bg-muted">
                      Special Programs
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="/"
              className="block py-2 px-3 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block py-2 px-3 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="block py-2 px-3 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            
            {user && (
              <>
                <div className="py-1 border-t border-border mt-3 pt-3">
                  <div className="text-sm text-muted-foreground mb-2">Tools</div>
                  <Link
                    href="/cost-analysis"
                    className="block py-2 px-3 rounded-md hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.costAnalysis')}
                  </Link>
                  <Link
                    href="/route-analysis"
                    className="block py-2 px-3 rounded-md hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.routeAnalysis')}
                  </Link>
                  <Link
                    href="/tariff-analysis"
                    className="block py-2 px-3 rounded-md hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.tariffAnalysis')}
                  </Link>
                </div>
                
                <div className="py-1 border-t border-border mt-3 pt-3">
                  <div className="text-sm text-muted-foreground mb-2">Account</div>
                  <Link
                    href="/profile"
                    className="block py-2 px-3 rounded-md hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block py-2 px-3 rounded-md hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left py-2 px-3 rounded-md hover:bg-muted"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
            
            {!user && (
              <div className="py-1 border-t border-border mt-3 pt-3">
                <Link
                  href="/auth/login"
                  className="block py-2 px-3 rounded-md hover:bg-muted text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="block py-2 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-center mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
