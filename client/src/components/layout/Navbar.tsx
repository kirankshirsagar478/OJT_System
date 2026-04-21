import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Menu, X, Bell } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return `/${user.role}/dashboard`; 
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">OJT Platform</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-slate-600 hover:text-accent font-medium transition">Log in</Link>
                <Link to="/register" className="btn-primary">Sign up</Link>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to={getDashboardLink()} className="text-slate-600 hover:text-accent font-medium transition">
                  Dashboard
                </Link>
                <div className="relative">
                  <div 
                    className="cursor-pointer text-slate-500 hover:text-accent transition p-1"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                  </div>
                  
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                          <h3 className="font-bold text-slate-800">Notifications</h3>
                          <span className="text-xs font-medium text-accent cursor-pointer hover:underline">Mark all as read</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer">
                            <p className="text-sm font-medium text-slate-800">System Update</p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">The OJT Platform has been updated with new features and minor bug fixes.</p>
                            <p className="text-[10px] text-slate-400 mt-2">Just now</p>
                          </div>
                          <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer">
                            <p className="text-sm font-medium text-slate-800">Welcome to the Platform!</p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">Complete your profile to get the most out of our OJT Management system.</p>
                            <p className="text-[10px] text-slate-400 mt-2">1 day ago</p>
                          </div>
                        </div>
                        <div className="p-3 text-center border-t border-slate-100">
                          <span className="text-sm font-medium text-slate-500 hover:text-accent cursor-pointer transition">View all activity</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="h-6 w-px bg-slate-300"></div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-slate-50 py-1.5 px-3 rounded-full border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-100 transition">
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 hidden lg:block">{user?.fullName}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-error transition flex items-center p-2 rounded-md hover:bg-red-50"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-slate-700 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                  <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium bg-accent text-white hover:bg-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
                </>
              ) : (
                <>
                  <div className="px-3 py-3 mb-2 border-b border-slate-100">
                    <div className="text-base font-medium text-slate-800">{user?.fullName}</div>
                    <div className="text-sm font-medium text-slate-500 capitalize">{user?.role}</div>
                  </div>
                  <Link to={getDashboardLink()} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-error hover:bg-red-50">Log out</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
