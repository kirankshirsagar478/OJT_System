import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Users, Calendar, ChevronDown, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const RecruiterOpportunities = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const res = await api.get('/recruiter/opportunities');
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

  const fetchApplicants = async (opportunityId: string) => {
    setExpandedId(expandedId === opportunityId ? null : opportunityId);
    if (expandedId === opportunityId) return;

    setLoadingApplicants(true);
    try {
      const res = await api.get(`/recruiter/applicants/${opportunityId}`);
      if (res.data.success) {
        setApplicants(res.data.applications);
      }
    } catch (error) {
      toast.error("Failed to load applicants");
    } finally {
      setLoadingApplicants(false);
    }
  };

  const updateApplicationStatus = async (appId: string, status: string) => {
    try {
      const res = await api.put(`/recruiter/application/${appId}`, { status });
      if (res.data.success) {
        toast.success(`Applicant marked as ${status}`);
        setApplicants(applicants.map(app => 
          app._id === appId ? { ...app, status } : app
        ));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to update status`);
    }
  };

  const filteredOpps = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Opportunities</h1>
          <p className="text-slate-500">View your postings and manage applicants.</p>
        </div>
        
        <div className="flex w-full md:w-auto space-x-3">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link to="/recruiter/opportunity/new" className="btn-primary flex items-center whitespace-nowrap">
            <Plus size={18} className="mr-1" /> New
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : filteredOpps.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredOpps.map((opp) => (
              <div key={opp._id} className="group">
                <div 
                  className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-slate-50 transition-colors ${expandedId === opp._id ? 'bg-slate-50' : ''}`}
                  onClick={() => fetchApplicants(opp._id)}
                >
                  <div className="mb-4 md:mb-0 flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className="text-lg font-bold text-slate-900 mr-3">{opp.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${
                        opp.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {opp.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap text-sm text-slate-500 gap-y-2 gap-x-4">
                      <span className="flex items-center"><Calendar size={14} className="mr-1" /> Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                      <span className="flex items-center text-accent font-medium"><Users size={14} className="mr-1" /> {opp.applicationCount || 0} Applicants</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <ChevronDown size={20} className={`text-slate-400 transition-transform ${expandedId === opp._id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === opp._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                    >
                      <div className="p-6">
                        <h4 className="font-semibold text-slate-800 mb-4 px-2 tracking-wide uppercase text-xs">Applicants List</h4>
                        
                        {loadingApplicants ? (
                          <div className="text-center p-4">Loading applicants...</div>
                        ) : applicants.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {applicants.map((app) => (
                              <div key={app._id} className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold mr-3">
                                      {app.studentId?.fullName?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-slate-900">{app.studentId?.fullName}</p>
                                      <p className="text-xs text-slate-500">{app.studentId?.email}</p>
                                    </div>
                                  </div>
                                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
                                    app.status === 'shortlisted' ? 'bg-amber-100 text-amber-700' :
                                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-slate-100 text-slate-600'
                                  }`}>
                                    {app.status}
                                  </span>
                                </div>
                                
                                <div className="border-t border-slate-100 pt-3 mt-auto flex justify-between items-center">
                                  <div className="text-xs text-slate-400">
                                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                  </div>
                                  {app.status === 'pending' && (
                                    <div className="flex space-x-2">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); updateApplicationStatus(app._id, 'rejected'); }}
                                        className="text-xs px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded transition"
                                      >
                                        Reject
                                      </button>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); updateApplicationStatus(app._id, 'shortlisted'); }}
                                        className="text-xs px-3 py-1.5 bg-accent text-white hover:bg-blue-600 rounded transition shadow-sm"
                                      >
                                        Shortlist
                                      </button>
                                    </div>
                                  )}
                                  {app.status !== 'pending' && (
                                    <span className="text-xs text-slate-500">
                                      Action completed
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-8 bg-white border border-slate-100 rounded-lg">
                            <Users size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="text-slate-500">No applications received yet.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No opportunities posted</h3>
            <p className="text-slate-500 mt-2">Create your first internship posting to start finding talent.</p>
            <Link to="/recruiter/opportunity/new" className="btn-primary inline-flex items-center mt-6">
              <Plus size={18} className="mr-1" /> Post Opportunity
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterOpportunities;
