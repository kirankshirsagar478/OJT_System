import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, FileText, Activity, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const RecruiterDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/recruiter/dashboard');
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

  const { stats, company, recentApplications } = data || {};
  const isVerified = company?.verificationStatus === 'verified';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Recruiter Dashboard</h1>
          <p className="text-slate-500">Overview of your company's OJT and internship postings.</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            to={isVerified ? "/recruiter/opportunity/new" : "#"} 
            className={`btn-primary flex items-center ${!isVerified && 'opacity-50 cursor-not-allowed'}`}
            onClick={(e) => !isVerified && e.preventDefault()}
          >
            <Briefcase size={18} className="mr-2" /> Post Opportunity
          </Link>
        </div>
      </div>

      {!isVerified && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3 mb-6">
          <AlertTriangle className="text-amber-500 mt-0.5" size={20} />
          <div>
            <h3 className="text-amber-800 font-semibold">Verification Pending</h3>
            <p className="text-amber-700 text-sm mt-1">
              Your company profile is pending verification by the platform coordinator. You cannot post new opportunities until verified. Please complete your <Link to="/recruiter/profile" className="underline font-medium hover:text-amber-900">Company Profile</Link> to expedite the process.
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Postings" 
          value={stats?.totalOpportunities || 0} 
          icon={<Briefcase className="text-blue-500" size={24} />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Open Positions" 
          value={stats?.openPositions || 0} 
          icon={<Activity className="text-indigo-500" size={24} />} 
          color="bg-indigo-50" 
        />
        <StatCard 
          title="Total Applications" 
          value={stats?.totalApplications || 0} 
          icon={<FileText className="text-amber-500" size={24} />} 
          color="bg-amber-50" 
        />
        <StatCard 
          title="Shortlisted" 
          value={stats?.shortlisted || 0} 
          icon={<Users className="text-emerald-500" size={24} />} 
          color="bg-emerald-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Recent Applications</h2>
            <Link to="/recruiter/opportunities" className="text-sm text-accent hover:text-blue-600 font-medium">Manage Opportunities</Link>
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
                      <p className="text-sm font-medium text-slate-900">{app.studentId?.fullName}</p>
                      <p className="text-xs text-slate-500">Applied for: {app.opportunityId?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={app.status} />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-slate-500">
                No recent applications found.
              </div>
            )}
          </div>
        </div>

        {/* Company Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Company Overview</h2>
          </div>
          <div className="p-6">
            <h3 className="font-bold text-xl text-slate-900 mb-1">{company?.companyName || 'Your Company'}</h3>
            <p className="text-slate-500 text-sm mb-6">{company?.industryType || 'Industry not specified'}</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                <span className="text-slate-500">Status</span>
                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                  company?.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                  company?.verificationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {company?.verificationStatus || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                <span className="text-slate-500">Location</span>
                <span className="text-slate-800 font-medium">{company?.location || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                <span className="text-slate-500">HR Contact</span>
                <span className="text-slate-800 font-medium">{company?.hrName || '-'}</span>
              </div>
            </div>

            <Link to="/recruiter/profile" className="w-full btn-secondary mt-6 flex justify-center">
              Edit Profile
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

export default RecruiterDashboard;
