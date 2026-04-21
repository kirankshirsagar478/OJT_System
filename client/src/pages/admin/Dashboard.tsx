import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Activity, TrendingUp, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/analytics');
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

  const { stats, applicationStats } = data || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Analytics Overview</h1>
          <p className="text-slate-500">System-wide metrics and user activity.</p>
        </div>
      </div>

      {/* Warning for Pending Recruiters */}
      {stats?.pendingVerifications > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <Building className="text-amber-500" size={24} />
            <div>
              <h3 className="text-amber-800 font-semibold">{stats.pendingVerifications} Recruiter(s) Pending Verification</h3>
              <p className="text-amber-700 text-sm mt-0.5">Approve new company accounts to let them post opportunities.</p>
            </div>
          </div>
          <Link to="/admin/recruiters" className="btn-secondary whitespace-nowrap !bg-white">
            Review Now
          </Link>
        </div>
      )}

      {/* Stats Grid - High Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={<Users className="text-indigo-500" size={24} />} 
          color="bg-indigo-50" 
        />
        <StatCard 
          title="Registered Students" 
          value={stats?.totalStudents || 0} 
          icon={<FileText className="text-blue-500" size={24} />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Total Recruiters" 
          value={stats?.totalRecruiters || 0} 
          icon={<Building className="text-emerald-500" size={24} />} 
          color="bg-emerald-50" 
        />
        <StatCard 
          title="Total Postings" 
          value={stats?.totalOpportunities || 0} 
          icon={<Activity className="text-purple-500" size={24} />} 
          color="bg-purple-50" 
        />
      </div>

      {/* Secondary Stats Group */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center">
              <TrendingUp size={20} className="mr-2 text-slate-500" /> System Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                <p className="text-sm font-medium text-slate-500 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-slate-800">{stats?.totalApplications || 0}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                <p className="text-sm font-medium text-slate-500 mb-1">Pending Approval</p>
                <p className="text-3xl font-bold text-amber-600">{stats?.pendingApplications || 0}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                <p className="text-sm font-medium text-slate-500 mb-1">Active OJT</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.activeOJT || 0}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                <p className="text-sm font-medium text-slate-500 mb-1">Completed OJT</p>
                <p className="text-3xl font-bold text-emerald-600">{stats?.completedOJT || 0}</p>
              </div>
            </div>
            
            <div className="mt-8 border border-slate-100 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold uppercase text-slate-500">Application Funnel Breakdown</span>
                </div>
                <div className="p-4">
                  {/* Pseudo Bar Chart */}
                  {applicationStats?.map((stat: any) => {
                    const max = Math.max(...applicationStats.map((s: any) => s.count), 1);
                    const width = `${(stat.count / max) * 100}%`;
                    const colors: any = {
                      pending: 'bg-slate-300',
                      shortlisted: 'bg-amber-400',
                      approved: 'bg-emerald-400',
                      rejected: 'bg-red-400'
                    };
                    return (
                      <div key={stat._id} className="mb-3 last:mb-0 flex items-center text-sm">
                        <div className="w-24 text-slate-600 capitalize text-right pr-3 font-medium">{stat._id}</div>
                        <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden flex items-center">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full ${colors[stat._id] || 'bg-blue-400'}`} 
                          />
                        </div>
                        <div className="w-12 text-slate-800 font-bold ml-3 text-right">{stat.count}</div>
                      </div>
                    );
                  })}
                </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Admin Actions</h2>
          </div>
          <div className="p-4 space-y-2">
            <Link to="/admin/recruiters" className="flex items-center p-3 rounded-lg hover:bg-slate-50 text-slate-700 transition border border-transparent hover:border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3">
                <Building size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium">Company Verifications</p>
                <p className="text-xs text-slate-500">Approve or reject new employers</p>
              </div>
            </Link>
            
            <Link to="/admin/users" className="flex items-center p-3 rounded-lg hover:bg-slate-50 text-slate-700 transition border border-transparent hover:border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center mr-3">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium">User Management</p>
                <p className="text-xs text-slate-500">Manage accounts across all roles</p>
              </div>
            </Link>

            <Link to="/admin/audit-logs" className="flex items-center p-3 rounded-lg hover:bg-slate-50 text-slate-700 transition border border-transparent hover:border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mr-3">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium">Audit Logs</p>
                <p className="text-xs text-slate-500">Review system events & security</p>
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

export default AdminDashboard;
