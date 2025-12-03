import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  User, 
  LogOut, 
  Menu, 
  X,
  Settings as SettingsIcon
} from 'lucide-react';

const Layout = ({ user, onLogout, children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = user.role === 'student' ? [
    { path: '/', label: 'ملفي الشخصي', icon: User }
  ] : user.role === 'principal' ? [
    { path: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { path: '/students', label: 'الطالبات', icon: Users },
    { path: '/behaviors', label: 'السلوكيات', icon: TrendingUp },
    { path: '/reports', label: 'التقارير', icon: User },
    { path: '/settings', label: 'الإعدادات', icon: SettingsIcon },
    { path: '/profile', label: 'الملف الشخصي', icon: User }
  ] : [
    { path: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { path: '/students', label: 'الطالبات', icon: Users },
    { path: '/behaviors', label: 'السلوكيات', icon: TrendingUp },
    { path: '/reports', label: 'التقارير', icon: User },
    { path: '/profile', label: 'الملف الشخصي', icon: User }
  ];

  const getRoleLabel = (role) => {
    switch (role) {
      case 'principal': return 'مديرة المدرسة';
      case 'teacher': return 'معلمة';
      case 'student': return 'طالبة';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-l from-blue-600 via-blue-700 to-emerald-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <Link to={user.role === 'student' ? '/' : '/dashboard'} className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">رواد التميز</h1>
                <p className="text-xs text-blue-100">مدرسة متوسطة غران</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-md'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-blue-100">{getRoleLabel(user.role)}</p>
              </div>
              <Button
                variant="ghost"
                onClick={onLogout}
                className="text-white hover:bg-white/10 transition-colors duration-200"
                size="icon"
              >
                <LogOut className="w-5 h-5" />
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white hover:bg-white/10"
                size="icon"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-white/20">
              <div className="mb-4 pb-4 border-b border-white/20">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-blue-100">{getRoleLabel(user.role)}</p>
              </div>
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-white/20 backdrop-blur-lg border border-white/30'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">© 2025 رواد التميز - جميع الحقوق محفوظة</p>
            <p className="text-xs text-gray-500 mt-1">مديرة المدرسة: عائشة عبدالعزيز الراشدي</p>
            <p className="text-xs text-gray-400 mt-1">تصميم: امل عطيه المزروعي</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
