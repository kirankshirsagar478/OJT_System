import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from './store/authStore';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactSupport from './pages/ContactSupport';
import DashboardLayout from './components/layout/DashboardLayout';

import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentOpportunities from './pages/student/Opportunities';
import StudentApplications from './pages/student/Applications';
import StudentProgress from './pages/student/Progress';
import StudentProgressReports from './pages/student/ProgressReports';

import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterProfile from './pages/recruiter/Profile';
import RecruiterOpportunities from './pages/recruiter/Opportunities';
import PostOpportunity from './pages/recruiter/PostOpportunity';

import CoordinatorDashboard from './pages/coordinator/Dashboard';
import CoordinatorApplications from './pages/coordinator/Applications';
import CoordinatorProgress from './pages/coordinator/Progress';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminRecruiters from './pages/admin/Recruiters';
import AdminAuditLogs from './pages/admin/AuditLogs';

// Role Protected Route Component
const RoleProtectedRoute = ({ children, allowedRoles }: { children: ReactNode, allowedRoles: string[] }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  if (isLoading) return null; // App.tsx handles global loading
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  
  return children;
};

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<ContactSupport />} />

        {/* Protected Student Routes */}
        <Route path="/student/*" element={
          <RoleProtectedRoute allowedRoles={['student']}>
            <DashboardLayout activeRole="student">
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="opportunities" element={<StudentOpportunities />} />
                <Route path="applications" element={<StudentApplications />} />
                <Route path="progress" element={<StudentProgress />} />
                <Route path="progress-reports" element={<StudentProgressReports />} />
                {/* Fallback for invalid student routes */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          </RoleProtectedRoute>
        } />
        
        {/* Protected Recruiter Routes */}
        <Route path="/recruiter/*" element={
          <RoleProtectedRoute allowedRoles={['recruiter']}>
            <DashboardLayout activeRole="recruiter">
              <Routes>
                <Route path="dashboard" element={<RecruiterDashboard />} />
                <Route path="profile" element={<RecruiterProfile />} />
                <Route path="opportunities" element={<RecruiterOpportunities />} />
                <Route path="opportunity/new" element={<PostOpportunity />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          </RoleProtectedRoute>
        } />

        {/* Protected Coordinator Routes */}
        <Route path="/coordinator/*" element={
          <RoleProtectedRoute allowedRoles={['coordinator']}>
            <DashboardLayout activeRole="coordinator">
              <Routes>
                <Route path="dashboard" element={<CoordinatorDashboard />} />
                <Route path="applications" element={<CoordinatorApplications />} />
                <Route path="progress" element={<CoordinatorProgress />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          </RoleProtectedRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout activeRole="admin">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="recruiters" element={<AdminRecruiters />} />
                <Route path="audit-logs" element={<AdminAuditLogs />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          </RoleProtectedRoute>
        } />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
