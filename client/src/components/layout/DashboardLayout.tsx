import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Building2, 
  Briefcase, 
  Users, 
  CheckSquare, 
  FileText, 
  Activity, 
  Settings,
  LayoutDashboard,
  Menu,
  X,
  ChevronLeft,
  ClipboardList
} from 'lucide-react';
import Navbar from './Navbar';

interface SidebarItem {
  name: string;
  path: string;
  icon: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  activeRole: 'student' | 'recruiter' | 'coordinator' | 'admin';
}

const DashboardLayout = ({ children, activeRole }: DashboardLayoutProps) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Define sidebar links based on role
  const getSidebarLinks = (): SidebarItem[] => {
    switch (activeRole) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'Profile', path: '/student/profile', icon: <Users size={20} /> },
          { name: 'Opportunities', path: '/student/opportunities', icon: <Briefcase size={20} /> },
          { name: 'My Applications', path: '/student/applications', icon: <FileText size={20} /> },
          { name: 'OJT Progress', path: '/student/progress', icon: <Activity size={20} /> },
          { name: 'Progress Reports', path: '/student/progress-reports', icon: <ClipboardList size={20} /> },
        ];
      case 'recruiter':
        return [
          { name: 'Dashboard', path: '/recruiter/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'Company Profile', path: '/recruiter/profile', icon: <Building2 size={20} /> },
          { name: 'Opportunities', path: '/recruiter/opportunities', icon: <Briefcase size={20} /> },
          { name: 'Post Opportunity', path: '/recruiter/opportunity/new', icon: <CheckSquare size={20} /> },
        ];
      case 'coordinator':
        return [
          { name: 'Dashboard', path: '/coordinator/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'Applications', path: '/coordinator/applications', icon: <FileText size={20} /> },
          { name: 'OJT Progress', path: '/coordinator/progress', icon: <Activity size={20} /> },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
          { name: 'Recruiters', path: '/admin/recruiters', icon: <Building2 size={20} /> },
          { name: 'Audit Logs', path: '/admin/audit-logs', icon: <FileText size={20} /> },
          { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
        ];
      default:
        return [];
    }
  };

  const links = getSidebarLinks();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar toggle */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-800 bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`
            fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col pt-16 md:pt-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="flex items-center justify-between px-4 py-4 md:hidden border-b border-slate-200">
            <span className="font-semibold text-slate-800">Menu</span>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} className="text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="mb-6 px-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {activeRole} PANEL
              </p>
            </div>
            
            <nav className="space-y-1">
              {links.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-accent' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                    `}
                  >
                    <span className={`mr-3 ${isActive ? 'text-accent' : 'text-slate-400'}`}>
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.fullName}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative overflow-y-auto">
          {/* Mobile open button */}
          <div className="md:hidden sticky top-0 z-10 bg-white border-b border-slate-200 p-4 flex items-center shadow-sm">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-500 flex items-center hover:text-accent">
              <Menu size={24} className="mr-2" />
              <span className="font-medium">Dashboard Menu</span>
            </button>
          </div>

          {/* Reverse Navigation Breadcrumb */}
          {window.history.length > 2 && location.pathname.split('/').length > 3 && (
            <div className="px-4 pt-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-0 flex items-center">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-sm font-medium text-slate-500 hover:text-accent bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm hover:shadow transition-all"
              >
                <ChevronLeft size={16} className="mr-1" />
                Go Back
              </button>
            </div>
          )}
          
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
