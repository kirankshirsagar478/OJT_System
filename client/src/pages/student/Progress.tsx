import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Building, Calendar, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const StudentProgress = () => {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/student/progress');
      if (res.data.success) {
        setProgressData(res.data.progress);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to load your OJT progress");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My OJT Progress</h1>
        <p className="text-slate-500">Track your current and past on-the-job training modules.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : progressData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50">
            {progressData.map((prog, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={prog._id} 
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="absolute top-4 right-4">
                   <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded border ${
                      prog.endDate ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                    }`}>
                      {prog.endDate ? 'Completed' : 'Active'}
                   </span>
                </div>
                
                <div className="flex items-center mb-4 mt-2">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold mr-3">
                    <Building size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{prog.companyId?.companyName}</h3>
                    <p className="text-xs text-slate-500">{prog.companyId?.location}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center font-medium text-sm text-slate-700">
                    <CheckCircle size={16} className="text-emerald-500 mr-2" /> 
                    Mentor: <span className="ml-1 text-slate-500">{prog.mentor || 'Not Assigned'}</span>
                  </div>
                  <div className="flex items-center font-medium text-sm text-slate-700">
                    <Calendar size={16} className="text-blue-500 mr-2" /> 
                    Start: <span className="ml-1 text-slate-500">{prog.startDate ? new Date(prog.startDate).toLocaleDateString() : '-'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                   <div>
                     <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Performance</p>
                     {prog.performanceStatus && prog.performanceStatus !== 'pending' ? (
                       <span className={`capitalize text-sm font-bold ${
                         prog.performanceStatus === 'excellent' ? 'text-emerald-600' :
                         prog.performanceStatus === 'good' ? 'text-blue-600' :
                         prog.performanceStatus === 'poor' ? 'text-red-600' :
                         'text-amber-600'
                       }`}>
                         {prog.performanceStatus}
                       </span>
                     ) : (
                       <span className="text-sm font-medium text-slate-500 italic">Evaluating</span>
                     )}
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Attendance</p>
                     <p className="text-lg font-bold text-slate-800">{prog.attendance}%</p>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center p-16">
            <Activity size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No active OJT records</h3>
            <p className="text-slate-500 mt-2">Your progress will appear here once your placement is approved.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgress;
