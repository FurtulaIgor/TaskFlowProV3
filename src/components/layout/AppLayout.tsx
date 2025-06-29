import { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import {
  Calendar, Users, FileText, BarChart2,
  MessageSquare, Settings, Menu, X, LogOut, Shield
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguage } from '../../lib/i18n';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import LanguageSelector from '../common/LanguageSelector';

const AppLayout: React.FC = () => {
  const { user, checkRole, signOut, isLoading, roles } = useAuthStore();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isAdmin = checkRole('admin');
  console.log('Current user roles:', roles); // Debug log
  console.log('Is admin?', isAdmin); // Debug log

  const navigation = [
    { name: t.nav.dashboard, to: '/app', icon: BarChart2 },
    { name: t.nav.appointments, to: '/app/appointments', icon: Calendar },
    { name: t.nav.clients, to: '/app/clients', icon: Users },
    { name: t.nav.invoices, to: '/app/invoices', icon: FileText },
    { name: t.nav.messages, to: '/app/messages', icon: MessageSquare },
    ...(isAdmin ? [{ name: t.nav.admin, to: '/app/admin', icon: Shield }] : []),
    { name: t.nav.settings, to: '/app/settings', icon: Settings }
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center px-4 mb-6">
            <h1 className="text-xl font-bold text-blue-600">TaskFlowPro</h1>
          </div>
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === '/app'}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center border-t p-4">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">{user?.email}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-1"
                onClick={handleSignOut}
              >
                <LogOut className="mr-1 h-4 w-4" />
                {t.common.logout}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Open main menu</span>
          {isMobileMenuOpen ? (
            <X className="block h-6 w-6" />
          ) : (
            <Menu className="block h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:hidden fixed inset-0 z-40 bg-white`}
      >
        <div className="pt-16 px-2 flex flex-col h-full">
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === '/app'}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-4 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="border-t p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-base font-medium text-gray-700 truncate">{user?.email}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  {t.common.logout}
                </Button>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center md:hidden">
          <h1 className="text-lg font-semibold text-gray-900">TaskFlowPro</h1>
          <LanguageSelector />
        </header>
        <div className="hidden md:flex justify-end p-4">
          <LanguageSelector />
        </div>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;