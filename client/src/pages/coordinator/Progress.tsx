import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Activity, Building, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CoordinatorProgress = () => {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/coordinator/progress');
      if (res.data.success) {
        setProgressData(res.data.progress);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to load OJT progress data");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = progressData.filter(prog => 
    (prog.studentId?.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
    (prog.companyId?.companyName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">OJT Progress Matrix</h1>
          <p className="text-slate-500">Monitor active and completed student training.</p>
        </div>
        
        <div className="w-full md:w-72 relative">
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
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Company Details</th>
                  <th className="px-6 py-4">Status & Timeline</th>
                  <th className="px-6 py-4 text-center">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((prog, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={prog._id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold mr-3">
                          {prog.studentId?.fullName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{prog.studentId?.fullName}</p>
                          <p className="text-xs text-slate-500">{prog.studentId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 flex items-center">
                          <Building size={14} className="mr-1.5 text-slate-400" />
                          {prog.companyId?.companyName}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Mentor: <span className="font-medium text-slate-700">{prog.mentor || 'Not assigned'}</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="mb-2 flex items-center">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                          prog.endDate ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                        }`}>
                          {prog.endDate ? 'Completed' : 'Active'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 flex flex-col space-y-1">
                        <span className="flex items-center"><Calendar size={12} className="mr-1" /> Start: {prog.startDate ? new Date(prog.startDate).toLocaleDateString() : '-'}</span>
                        <span className="flex items-center"><Calendar size={12} className="mr-1" /> End: {prog.endDate ? new Date(prog.endDate).toLocaleDateString() : 'Ongoing'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {prog.performanceStatus && prog.performanceStatus !== 'pending' ? (
                        <div className="flex flex-col items-center">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                            prog.performanceStatus === 'excellent' ? 'bg-emerald-100 text-emerald-700' :
                            prog.performanceStatus === 'good' ? 'bg-blue-100 text-blue-700' :
                            prog.performanceStatus === 'poor' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {prog.performanceStatus}
                          </span>
                          {prog.attendance > 0 && (
                            <span className="text-[10px] mt-1 text-slate-500 font-medium">Att: {prog.attendance}%</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Evaluating</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-12">
            <Activity size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No active OJT records</h3>
            <p className="text-slate-500 mt-2">Records will appear once applications are approved.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorProgress;
