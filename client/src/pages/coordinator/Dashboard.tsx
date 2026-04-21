import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Activity, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const CoordinatorDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/coordinator/dashboard');
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

  const { stats, recentApplications } = data || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Coordinator Dashboard</h1>
          <p className="text-slate-500">Monitor and manage the entire On-Job Training lifecycle.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Pending Approvals" 
          value={stats?.pendingApprovals || 0} 
          icon={<Clock className="text-amber-500" size={24} />} 
          color="bg-amber-50" 
        />
        <StatCard 
          title="Active OJT" 
          value={stats?.activeOJT || 0} 
          icon={<Activity className="text-blue-500" size={24} />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Completed OJT" 
          value={stats?.completedOJT || 0} 
          icon={<CheckCircle className="text-emerald-500" size={24} />} 
          color="bg-emerald-50" 
        />
        <StatCard 
          title="Total Students" 
          value={stats?.totalStudents || 0} 
          icon={<Users className="text-indigo-500" size={24} />} 
          color="bg-indigo-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Applications requiring action */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center">
              Requires Attention 
              {stats?.pendingApprovals > 0 && (
                <span className="ml-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {stats.pendingApprovals}
                </span>
              )}
            </h2>
            <Link to="/coordinator/applications" className="text-sm text-accent hover:text-blue-600 font-medium">View All Pending</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentApplications?.length > 0 ? (
              recentApplications.map((app: any, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={app._id} 
                  className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                      {app.studentId?.fullName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="text-sm border-b border-transparent hover:border-slate-300 font-medium text-slate-900 cursor-pointer">{app.studentId?.fullName}</p>
                      <p className="text-xs text-slate-500">Shortlisted for: <span className="font-medium">{app.opportunityId?.title}</span> at {app.opportunityId?.companyId?.companyName}</p>
                    </div>
                  </div>
                  <div>
                    <Link to="/coordinator/applications" className="btn-secondary py-1.5 px-3 text-xs">
                      Review
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-slate-500">
                <CheckCircle size={32} className="mx-auto text-emerald-400 mb-2" />
                No applications require immediate attention.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Quick Links</h2>
          </div>
          <div className="p-4 space-y-2">
            <Link to="/coordinator/applications" className="flex items-center p-3 rounded-lg hover:bg-slate-50 text-slate-700 transition">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center mr-3">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium">Applications</p>
                <p className="text-xs text-slate-500">Approve or reject shortlisted students</p>
              </div>
            </Link>
            
            <Link to="/coordinator/progress" className="flex items-center p-3 rounded-lg hover:bg-slate-50 text-slate-700 transition">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-accent flex items-center justify-center mr-3">
                <Activity size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium">OJT Progress</p>
                <p className="text-xs text-slate-500">Monitor active internships & attendance</p>
              </div>
            </Link>
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

export default CoordinatorDashboard;
