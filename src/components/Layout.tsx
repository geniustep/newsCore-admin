import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useTheme } from '../contexts/ThemeContext';
import {
  HomeIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  TagIcon,
  PhotoIcon,
  UsersIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ListBulletIcon,
  PaintBrushIcon,
  MoonIcon,
  SunIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: HomeIcon },
  { name: 'المقالات', href: '/articles', icon: DocumentTextIcon },
  { name: 'الصفحات', href: '/pages', icon: DocumentDuplicateIcon },
  { name: 'التصنيفات', href: '/categories', icon: FolderIcon },
  { name: 'الوسوم', href: '/tags', icon: TagIcon },
  { name: 'الوسائط', href: '/media', icon: PhotoIcon },
  { name: 'الأخبار العاجلة', href: '/breaking-news', icon: ExclamationTriangleIcon },
  { name: 'المقالات المجدولة', href: '/scheduled-posts', icon: ClockIcon },
  { name: 'التحليلات', href: '/analytics', icon: ChartBarIcon },
  { name: 'القوائم', href: '/menus', icon: ListBulletIcon },
  { name: 'المستخدمين', href: '/users', icon: UsersIcon },
  { name: 'إعدادات القالب', href: '/theme', icon: PaintBrushIcon },
  { name: 'الإعدادات', href: '/settings', icon: Cog6ToothIcon },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { currentLogo, isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 shadow-xl transform transition-transform duration-300 lg:hidden flex flex-col ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b flex-shrink-0" style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
          {currentLogo ? (
            <img src={currentLogo} alt="Logo" className="h-8 object-contain" />
          ) : (
            <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>NewsCore</span>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:opacity-80"
            style={{ backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
          >
            <XMarkIcon className="w-6 h-6" style={{ color: 'var(--color-text)' }} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--color-text)',
              })}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:opacity-80"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-full border-l" style={{ backgroundColor: 'var(--color-background)', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
          <div className="flex items-center justify-between h-16 px-6 border-b flex-shrink-0" style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
            {currentLogo ? (
              <img src={currentLogo} alt="Logo" className="h-8 object-contain" />
            ) : (
              <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>NewsCore</span>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:opacity-80"
              style={{ backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
              ) : (
                <MoonIcon className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
              )}
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto min-h-0">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--color-text)',
                  fontWeight: isActive ? '500' : '400',
                })}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:opacity-80"
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t flex-shrink-0" style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.2 }}>
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                  {user?.displayName}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--color-text)', opacity: 0.6 }}>{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm rounded-lg transition-colors hover:opacity-80"
              style={{ color: '#ef4444', backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pr-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 border-b lg:px-8" style={{ backgroundColor: 'var(--color-background)', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:opacity-80 lg:hidden"
            style={{ backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
          >
            <Bars3Icon className="w-6 h-6" style={{ color: 'var(--color-text)' }} />
          </button>
          <div className="flex-1" />
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:opacity-80 lg:hidden"
            style={{ backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
            title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
            ) : (
              <MoonIcon className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
            )}
          </button>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8" style={{ backgroundColor: isDarkMode ? 'var(--color-background)' : '#f9fafb', minHeight: 'calc(100vh - 4rem)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

