import React, { useState, useEffect } from 'react';
import { Home, Search, MessageSquare, User, Wallet, Settings, Bell, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { getProfile } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, hideNav = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, setUserData } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        setUserData(JSON.parse(user));
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  }, [setUserData]);

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Jobs', path: '/jobs' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center p-6 sm:p-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-4 sm:mb-6 mx-auto">
            <img src="/logo.png" alt="StuDex Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome to StuDex</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Please sign in to access your account</p>
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <LogIn size={18} className="sm:w-5 sm:h-5" />
              Sign In
            </button>
            <button
              onClick={() => navigate('/welcome')}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              <UserPlus size={18} className="sm:w-5 sm:h-5" />
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      
      {/* Sidebar Navigation */}
      {!hideNav && (
        <div className={`w-64 sm:w-72 lg:w-72 bg-white shadow-xl border-r border-gray-100 flex flex-col fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          {/* Logo Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                  <img src="/logo.png" alt="StuDex Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">StuDex</h1>
                  <p className="text-xs sm:text-sm text-gray-500">Desktop App</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-600 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path) 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={18} className="sm:w-5 sm:h-5" strokeWidth={isActive(item.path) ? 2.5 : 2} />
                <span className="font-medium text-sm sm:text-base">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <button 
              onClick={() => {
                navigate('/settings');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/settings') 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Settings size={20} strokeWidth={isActive('/settings') ? 2.5 : 2} />
              <span className="font-medium text-base">Settings</span>
            </button>
            <button 
              onClick={() => navigate('/notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/notifications') 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Bell size={20} strokeWidth={isActive('/notifications') ? 2.5 : 2} />
              <span className="font-medium text-base">Notifications</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            {!hideNav && (
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={18} className="text-gray-600 sm:w-5 sm:h-5" />
              </button>
            )}
            <div className="text-xs sm:text-sm lg:text-base text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => navigate('/notifications')}
              title="Notifications" 
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Bell size={16} className="text-gray-600 sm:w-[18px] sm:h-[18px]" />
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            </button>
            {userData?.profileImageUrl ? (
              <img 
                src={userData.profileImageUrl} 
                alt="Profile" 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                onClick={() => navigate('/profile')}
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all" onClick={() => navigate('/profile')}>
                <span className="text-white text-xs sm:text-sm font-medium">{userData?.firstName?.[0] || userData?.username?.[0] || 'U'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};