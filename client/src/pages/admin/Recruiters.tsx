import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminRecruiters = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('pending'); // 'pending', 'verified', 'rejected', 'all'

  useEffect(() => {
    fetchRecruiters();
  }, [filter]);

  const fetchRecruiters = async () => {
    setIsLoading(true);
    try {
      const url = filter === 'all' ? '/admin/recruiters' : `/admin/recruiters?status=${filter}`;
      const res = await api.get(url);
      if (res.data.success) {
        setCompanies(res.data.companies);
      }
    } catch (error) {
      console.error("Error fetching recruiters:", error);
      toast.error("Failed to load recruiter profiles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (companyId: string, status: string) => {
    if (!window.confirm(`Are you sure you want to mark this company as ${status}?`)) return;

    try {
      const res = await api.put(`/admin/recruiter/${companyId}/verify`, { verificationStatus: status });
      if (res.data.success) {
        toast.success(`Company marked as ${status}`);
        if (filter !== 'all') {
          setCompanies(companies.filter(c => c._id !== companyId));
        } else {
          setCompanies(companies.map(c => 
            c._id === companyId ? { ...c, verificationStatus: status } : c
          ));
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to update status`);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.companyName.toLowerCase().includes(search.toLowerCase()) || 
    (c.userId?.fullName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Company Verifications</h1>
          <p className="text-slate-500">Review and verify employer accounts.</p>
        </div>
        
        <div className="flex w-full md:w-auto space-x-3">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search company or HR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="input-field max-w-[150px]"
          >
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : filteredCompanies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">Company Details</th>
                  <th className="px-6 py-4">Account Owner (HR)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.map((comp, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={comp._id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 text-accent border border-blue-100 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                          {comp.companyName?.charAt(0) || 'C'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{comp.companyName}</p>
                          <p className="text-xs text-slate-500 truncate">{comp.location || 'Location not set'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{comp.userId?.fullName || comp.hrName || 'Unknown'}</p>
                        <p className="text-xs text-slate-500 truncate">{comp.userId?.email || comp.hrEmail || '-'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                        comp.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                        comp.verificationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {comp.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {comp.verificationStatus === 'pending' ? (
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleVerification(comp._id, 'verified')}
                            className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 rounded transition font-medium"
                          >
                            Verify
                          </button>
                          <button 
                            onClick={() => handleVerification(comp._id, 'rejected')}
                            className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded transition font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500">
                          Action completed
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
            <Building size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No companies found</h3>
            <p className="text-slate-500 mt-2">Try changing the status filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecruiters;
