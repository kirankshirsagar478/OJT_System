import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, FileText, Building, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Applications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/student/applications');
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

  const filteredApps = applications.filter(app => 
    app.opportunityId?.title.toLowerCase().includes(search.toLowerCase()) || 
    app.opportunityId?.companyId?.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Applications</h1>
          <p className="text-slate-500">Track the status of your internship applications.</p>
        </div>
        
        <div className="w-full md:w-72 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                  <th className="px-6 py-4">Role & Company</th>
                  <th className="px-6 py-4">Applied On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Remarks</th>
                  <th className="px-6 py-4 text-right">Action</th>
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
                        <div className="h-10 w-10 rounded-lg bg-blue-50 text-accent flex items-center justify-center font-bold mr-3 border border-blue-100">
                          {app.opportunityId?.companyId?.companyName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{app.opportunityId?.title}</p>
                          <p className="text-xs text-slate-500 flex items-center mt-0.5">
                            <Building size={12} className="mr-1" />
                            {app.opportunityId?.companyId?.companyName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-slate-400" />
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500 line-clamp-1 max-w-xs" title={app.remarks}>
                        {app.remarks || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button className="text-slate-400 hover:text-accent transition-colors p-2 rounded-md hover:bg-slate-100 inline-flex">
                        <ChevronRight size={18} />
                      </button>
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
            <p className="text-slate-500 mt-2">You haven't submitted any applications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    pending: 'bg-slate-100 text-slate-700 border-slate-200',
    shortlisted: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

export default Applications;
