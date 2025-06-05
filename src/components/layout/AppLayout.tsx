import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  FileText, 
  BarChart2, 
  MessageSquare, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  Shield 
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../ui/Button';

const AppLayout: React.FC = () => {
  const { user, isAdmin, signOut, loadUser } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadUser();
  }, [loadUser]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  const navigation = [
    { name: 'Dashboard', to: '/', icon: BarChart2 },
    { name: 'Appointments', to: '/appointments', icon: Calendar },
    { name: 'Clients', to: '/clients', icon: Users },
    { name: 'Invoices', to: '/invoices', icon: FileText },
    { name: 'Messages', to: '/messages', icon: MessageSquare }
  ];
  
  // Add admin route if user is admin
  if (isAdmin) {
    navigation.push({ name: 'Admin', to: '/admin', icon: Shield });
  }
  
  // Add settings route
  navigation.push({ name: 'Settings', to: '/settings', icon: Settings });
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-blue-600">TaskFlowPro</h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {user?.email}
                </p>
                <button
                  onClick={handleSignOut}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <LogOut className="mr-1 h-3 w-3" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-blue-600">TaskFlowPro</h1>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Open sidebar</span>
          {isMobileMenuOpen ? (
            <X className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 z-30 bg-gray-600 bg-opacity-75 transition-opacity ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      />
      
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-30 w-full max-w-xs bg-white transform transition duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col pt-16 pb-4 overflow-y-auto">
          <div className="flex-grow mt-5 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                  onClick={closeMobileMenu}
                >
                  <item.icon className="mr-4 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-base font-medium text-gray-700 truncate">
                  {user?.email}
                </p>
                <Button onClick={handleSignOut} variant="outline" size="sm" className="mt-1">
                  <LogOut className="mr-1 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none md:p-8 p-4 pt-20 md:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;