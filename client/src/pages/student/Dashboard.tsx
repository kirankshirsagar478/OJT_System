import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Clock, CheckCircle, XCircle, ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const StudentDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/student/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalApplications: 0,
    pendingApplications: 0,
    shortlisted: 0,
    approved: 0,
    rejected: 0,
    openOpportunities: 0,
    ojtStatus: 'not-started'
  };

  const recentApplications = data?.recentApplications || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here's your OJT overview.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/student/opportunities" className="btn-primary flex items-center">
            <Briefcase size={18} className="mr-2" /> Browse Opportunities
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Open Opportunities" 
          value={stats.openOpportunities} 
          icon={<Briefcase className="text-blue-500" size={24} />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Total Applications" 
          value={stats.totalApplications} 
          icon={<FileText className="text-indigo-500" size={24} />} 
          color="bg-indigo-50" 
        />
        <StatCard 
          title="Pending / Shortlisted" 
          value={`${stats.pendingApplications} / ${stats.shortlisted}`} 
          icon={<Clock className="text-amber-500" size={24} />} 
          color="bg-amber-50" 
        />
        <StatCard 
          title="Approved" 
          value={stats.approved} 
          icon={<CheckCircle className="text-emerald-500" size={24} />} 
          color="bg-emerald-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Recent Applications</h2>
            <Link to="/student/applications" className="text-sm text-accent hover:text-blue-600 font-medium">View All</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentApplications.length > 0 ? (
              recentApplications.map((app: any, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={app._id} 
                  className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-semibold">
                      {app.opportunityId?.companyId?.companyName?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{app.opportunityId?.title}</p>
                      <p className="text-xs text-slate-500">{app.opportunityId?.companyId?.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={app.status} />
                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-slate-500">
                You haven't applied to any opportunities yet.
              </div>
            )}
          </div>
        </div>

        {/* OJT Status Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Your OJT Status</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
              stats.ojtStatus === 'completed' ? 'bg-emerald-100 text-emerald-600' :
              stats.ojtStatus === 'in-progress' ? 'bg-amber-100 text-amber-600' :
              'bg-slate-100 text-slate-500'
            }`}>
              {stats.ojtStatus === 'completed' ? <CheckCircle size={40} /> :
               stats.ojtStatus === 'in-progress' ? <Clock size={40} /> :
               <XCircle size={40} />}
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 capitalize mb-2">
              {stats.ojtStatus.replace('-', ' ')}
            </h3>
            
            <p className="text-sm text-slate-500 mb-6">
              {stats.ojtStatus === 'completed' ? "Congratulations! You have successfully completed your training." :
               stats.ojtStatus === 'in-progress' ? "Your training is currently ongoing. Keep up the good work!" :
               "You have not started your On-Job Training yet. Start by applying to opportunities."}
            </p>

            {stats.ojtStatus === 'not-started' && (
              <Link to="/student/profile" className="btn-secondary w-full">
                Complete Your Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center space-x-4">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    pending: 'bg-slate-100 text-slate-700',
    shortlisted: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700'
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

export default StudentDashboard;
