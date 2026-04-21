import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const url = moduleFilter ? `/admin/audit-logs?module=${moduleFilter}` : '/admin/audit-logs';
      const res = await api.get(url);
      if (res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to load audit logs");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    (log.details || '').toLowerCase().includes(search.toLowerCase()) || 
    (log.userId?.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (log.actionType || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Audit Logs</h1>
          <p className="text-slate-500">Track and monitor important system events.</p>
        </div>
        
        <div className="flex w-full md:w-auto space-x-3">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search details or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            value={moduleFilter} 
            onChange={(e) => setModuleFilter(e.target.value)}
            className="input-field max-w-[150px]"
          >
            <option value="">All Modules</option>
            <option value="Auth">Auth</option>
            <option value="User">User</option>
            <option value="Company">Company</option>
            <option value="Opportunity">Opportunity</option>
            <option value="Application">Application</option>
            <option value="StudentProfile">Profile</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Action & Module</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    key={log._id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-2 text-slate-400" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${
                        log.actionType === 'CREATE' || log.actionType === 'REGISTER' ? 'bg-emerald-100 text-emerald-700' :
                        log.actionType === 'UPDATE' ? 'bg-amber-100 text-amber-700' :
                        log.actionType === 'DELETE' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {log.actionType}
                      </span>
                      <span className="ml-2 text-xs font-semibold text-slate-500 border border-slate-200 px-2 py-1 rounded">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.userId ? (
                        <div className="text-sm">
                          <p className="font-medium text-slate-800">{log.userId.email}</p>
                          <p className="text-xs text-slate-500 capitalize">{log.userId.role}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">System / Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 break-words">{log.details}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono text-xs">
                      {log.ip || '-'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-12">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No logs found</h3>
            <p className="text-slate-500 mt-2">Try changing your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogs;
