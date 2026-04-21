import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Building, Calendar, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CoordinatorApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('shortlisted'); // 'all', 'shortlisted', 'approved', 'rejected'

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const url = filter === 'all' ? '/coordinator/applications' : `/coordinator/applications?status=${filter}`;
      const res = await api.get(url);
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (appId: string, status: 'approved' | 'rejected') => {
    if (!window.confirm(`Are you sure you want to mark this application as ${status}?`)) return;

    try {
      const res = await api.put(`/coordinator/approve/${appId}`, { status });
      if (res.data.success) {
        toast.success(`Application ${status} successfully`);
        // Remove or update from list depending on filter
        if (filter !== 'all') {
          setApplications(applications.filter(app => app._id !== appId));
        } else {
          setApplications(applications.map(app => 
            app._id === appId ? { ...app, status } : app
          ));
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to update status`);
    }
  };

  const filteredApps = applications.filter(app => 
    (app.studentId?.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
    (app.opportunityId?.companyId?.companyName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Applications</h1>
          <p className="text-slate-500">Review and approve company-shortlisted candidates.</p>
        </div>
        
        <div className="flex w-full md:w-auto space-x-3">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search student or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="shortlisted">Pending Approval (Shortlisted)</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Applications</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Opportunity details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action / Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={app._id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold mr-3">
                          {app.studentId?.fullName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{app.studentId?.fullName}</p>
                          <p className="text-xs text-slate-500">{app.studentId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{app.opportunityId?.title}</p>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                          <Building size={12} className="mr-1" />
                          {app.opportunityId?.companyId?.companyName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                        app.status === 'shortlisted' ? 'bg-amber-100 text-amber-700' :
                        app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {app.status === 'shortlisted' ? 'Pending Approval' : app.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                        <Calendar size={10} className="mr-1" /> Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {app.status === 'shortlisted' ? (
                        <div className="flex justify-center space-x-2">
                          <button 
                            onClick={() => handleAction(app._id, 'approved')}
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded transition"
                            title="Approve Placement"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button 
                            onClick={() => handleAction(app._id, 'rejected')}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition"
                            title="Reject Placement"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-xs text-slate-500 font-medium">
                          Reviewed
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-12">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No applications found</h3>
            <p className="text-slate-500 mt-2">Try changing the filter or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorApplications;
