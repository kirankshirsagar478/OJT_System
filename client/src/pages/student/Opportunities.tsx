import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Building, Calendar, DollarSign, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const res = await api.get('/student/opportunities');
      if (res.data.success) {
        setOpportunities(res.data.opportunities);
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      toast.error("Failed to load opportunities");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (id: string) => {
    setApplyingTo(id);
    try {
      const res = await api.post(`/student/apply/${id}`);
      if (res.data.success) {
        toast.success("Application submitted successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setApplyingTo(null);
    }
  };

  const filteredOpps = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(search.toLowerCase()) || 
    (opp.companyId?.companyName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Browse Opportunities</h1>
          <p className="text-slate-500">Find the right internship or OJT for your career.</p>
        </div>
        
        <div className="w-full md:w-72 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search roles or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      ) : filteredOpps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOpps.map((opp, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={opp._id}
              className="card flex flex-col h-full"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-50 text-accent flex items-center justify-center font-bold text-xl border border-blue-100">
                    {opp.companyId?.companyName?.charAt(0) || 'C'}
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {opp.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-1">{opp.title}</h3>
                <p className="text-sm font-medium text-accent flex items-center mb-4">
                  <Building size={16} className="mr-1.5" />
                  {opp.companyId?.companyName}
                </p>

                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-slate-400" />
                    {opp.companyId?.location || 'Remote / Not specified'}
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-2 text-slate-400" />
                    {opp.stipend || 'Unpaid'}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-slate-400" />
                    Duration: {opp.duration || 'Not specified'}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 text-xs text-slate-600 line-clamp-3">
                    {opp.description}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {opp.requiredSkills?.slice(0, 3).map((skill: string) => (
                    <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      {skill}
                    </span>
                  ))}
                  {opp.requiredSkills?.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      +{opp.requiredSkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
                <button
                  onClick={() => handleApply(opp._id)}
                  disabled={applyingTo === opp._id}
                  className="w-full btn-primary py-2.5 flex justify-center items-center"
                >
                  {applyingTo === opp._id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
          <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No opportunities found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search criteria or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
