import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, ShieldOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const url = roleFilter ? `/admin/users?role=${roleFilter}` : '/admin/users';
      const res = await api.get(url);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const confirmMessage = currentStatus === 'active' 
      ? 'Are you sure you want to deactivate this account? They will not be able to log in.'
      : 'Are you sure you want to reactivate this account?';
      
    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await api.put(`/admin/user/${userId}`, { accountStatus: newStatus });
      if (res.data.success) {
        toast.success(`Account marked as ${newStatus}`);
        setUsers(users.map(u => u._id === userId ? { ...u, accountStatus: newStatus } : u));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to update status`);
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500">View and manage all system accounts.</p>
        </div>
        
        <div className="flex w-full md:w-auto space-x-3">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field max-w-[150px]"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
            <option value="coordinator">Coordinator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={user._id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold mr-3 flex-shrink-0">
                          {user.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{user.fullName}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'coordinator' ? 'bg-blue-100 text-blue-700' :
                        user.role === 'recruiter' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                         {user.accountStatus === 'active' ? (
                           <CheckCircle size={14} className="text-emerald-500 mr-1.5" />
                         ) : (
                           <ShieldOff size={14} className="text-red-500 mr-1.5" />
                         )}
                         <span className={`text-sm font-medium ${
                           user.accountStatus === 'active' ? 'text-emerald-600' : 'text-red-600'
                         }`}>
                           {user.accountStatus === 'active' ? 'Active' : 'Deactivated'}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => toggleUserStatus(user._id, user.accountStatus)}
                          className={`text-xs px-3 py-1.5 rounded transition font-medium border ${
                            user.accountStatus === 'active' 
                              ? 'border-red-200 text-red-600 hover:bg-red-50' 
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {user.accountStatus === 'active' ? 'Deactivate' : 'Reactivate'}
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <span className="text-xs text-slate-400 italic">Protected</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-12">
            <Users size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No users found</h3>
            <p className="text-slate-500 mt-2">Try changing the filter or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
