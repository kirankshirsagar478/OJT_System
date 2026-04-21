import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Plus,
  X,
  Download,
  Clock,
  Calendar,
  BookOpen,
  CheckSquare,
  MessageSquare,
  Loader2,
  ChevronDown,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

// ─── Types ────────────────────────────────────────────────────────────────────
type ReportType = 'daily' | 'weekly' | 'monthly';
type FilterType = 'all' | ReportType;

interface ProgressReport {
  _id: string;
  studentId: string;
  type: ReportType;
  date: string;
  tasks: string;
  learning: string;
  hoursWorked: number;
  remarks: string;
  createdAt: string;
}

interface FormState {
  type: ReportType;
  date: string;
  tasks: string;
  learning: string;
  hoursWorked: string;
  remarks: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split('T')[0];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const typeBadge: Record<ReportType, { label: string; bg: string; text: string; border: string }> = {
  daily: { label: 'Daily', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  weekly: { label: 'Weekly', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  monthly: { label: 'Monthly', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

// ─── PDF Generator ────────────────────────────────────────────────────────────
function generatePDF(report: ProgressReport, studentName: string) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 50;
  const contentW = pageW - margin * 2;

  // Header bar
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageW, 70, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('OJT Progress Report', margin, 44);

  // Sub-header
  doc.setFillColor(239, 246, 255);
  doc.rect(0, 70, pageW, 40, 'F');
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const badge = typeBadge[report.type];
  doc.text(
    `${badge.label} Report  •  ${formatDate(report.date)}  •  ${studentName}`,
    margin,
    96
  );

  let y = 140;
  const lineH = 18;
  const labelColor: [number, number, number] = [71, 85, 105];
  const valueColor: [number, number, number] = [15, 23, 42];

  const addSection = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...labelColor);
    doc.text(label.toUpperCase(), margin, y);
    y += lineH - 4;

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentW, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(...valueColor);
    const lines = doc.splitTextToSize(value || '—', contentW);
    doc.text(lines, margin, y);
    y += lines.length * lineH + 20;
  };

  addSection('Tasks Completed', report.tasks);
  addSection('Key Learnings', report.learning);
  addSection('Hours Worked', `${report.hoursWorked} hour(s)`);
  if (report.remarks) addSection('Remarks', report.remarks);

  // Footer
  doc.setFillColor(248, 250, 252);
  doc.rect(0, doc.internal.pageSize.getHeight() - 40, pageW, 40, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.text(
    `Generated on ${new Date().toLocaleString('en-IN')} | OJT Management System`,
    margin,
    doc.internal.pageSize.getHeight() - 16
  );

  doc.save(`Progress_Report_${report.type}_${report.date.split('T')[0]}.pdf`);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const TabBar = ({
  active,
  onChange,
}: {
  active: FilterType;
  onChange: (t: FilterType) => void;
}) => {
  const tabs: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Reports' },
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];
  return (
    <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            active === tab.key ? 'text-white' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {active === tab.key && (
            <motion.span
              layoutId="tab-pill"
              className="absolute inset-0 bg-blue-600 rounded-lg"
              style={{ zIndex: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

const EmptyState = ({ filter }: { filter: FilterType }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
      <FileText size={36} className="text-blue-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-700 mb-1">No reports found</h3>
    <p className="text-sm text-slate-400 max-w-xs">
      {filter === 'all'
        ? "You haven't submitted any progress reports yet. Use the form above to add your first one!"
        : `No ${filter} reports yet. Switch to a different tab or add a new report.`}
    </p>
  </motion.div>
);

const ReportCard = ({
  report,
  studentName,
  index,
}: {
  report: ProgressReport;
  studentName: string;
  index: number;
}) => {
  const badge = typeBadge[report.type];
  const isRecent =
    Date.now() - new Date(report.createdAt).getTime() < 24 * 60 * 60 * 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px -8px rgba(37,99,235,0.15)' }}
      className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden transition-shadow"
    >
      {/* Accent stripe */}
      <div
        className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl ${
          report.type === 'daily'
            ? 'bg-sky-500'
            : report.type === 'weekly'
            ? 'bg-violet-500'
            : 'bg-amber-500'
        }`}
      />

      {/* Header row */}
      <div className="flex items-start justify-between pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
          >
            {badge.label}
          </span>
          {isRecent && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              New
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
          <Calendar size={13} />
          {formatDate(report.date)}
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <CheckSquare size={12} /> Tasks Completed
          </span>
          <p className="text-slate-700 leading-relaxed line-clamp-3">{report.tasks}</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <BookOpen size={12} /> Learnings
          </span>
          <p className="text-slate-700 leading-relaxed line-clamp-3">{report.learning}</p>
        </div>
      </div>

      {report.remarks && (
        <div className="flex flex-col gap-1 text-sm">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <MessageSquare size={12} /> Remarks
          </span>
          <p className="text-slate-500 leading-relaxed line-clamp-2">{report.remarks}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
          <Clock size={15} className="text-blue-500" />
          {report.hoursWorked}h worked
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => generatePDF(report, studentName)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Download size={13} />
          Download PDF
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const INITIAL_FORM: FormState = {
  type: 'daily',
  date: today(),
  tasks: '',
  learning: '',
  hoursWorked: '',
  remarks: '',
};

const StudentProgressReports = () => {
  const { user } = useAuthStore();
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const formRef = useRef<HTMLDivElement>(null);

  const fetchReports = async (type?: FilterType) => {
    try {
      setIsLoading(true);
      const params = type && type !== 'all' ? { type } : {};
      const res = await api.get('/progress', { params });
      if (res.data.success) {
        setReports(res.data.reports);
        setTotalHours(res.data.totalHours);
      }
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(filter);
  }, [filter]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tasks.trim() || !form.learning.trim() || !form.hoursWorked) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.post('/progress', {
        ...form,
        hoursWorked: Number(form.hoursWorked),
      });
      if (res.data.success) {
        toast.success('Report saved successfully!');
        setForm(INITIAL_FORM);
        setShowForm(false);
        fetchReports(filter);
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || 'Failed to save report');
    } finally {
      setSubmitting(false);
    }
  };

  const studentName = user?.fullName || 'Student';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="text-blue-600" size={26} />
            Progress Reports
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Track your daily, weekly, and monthly OJT activities
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
            <TrendingUp size={16} className="text-blue-600" />
            <div>
              <p className="text-xs text-blue-500 font-medium">Total Hours</p>
              <p className="text-lg font-bold text-blue-700 leading-none">{totalHours}h</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-4 py-2.5">
            <FileText size={16} className="text-violet-600" />
            <div>
              <p className="text-xs text-violet-500 font-medium">Total Reports</p>
              <p className="text-lg font-bold text-violet-700 leading-none">{reports.length}</p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowForm((v) => !v);
              setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Close Form' : 'Add Report'}
          </motion.button>
        </div>
      </div>

      {/* ── Collapsible Form ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            ref={formRef}
            key="form"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm"
            >
              <h2 className="text-base font-semibold text-slate-800">New Progress Report</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Report Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Report Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                      className="w-full appearance-none border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    max={today()}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Hours Worked */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Hours Worked <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="hoursWorked"
                    value={form.hoursWorked}
                    onChange={handleFormChange}
                    min={0}
                    max={24}
                    step={0.5}
                    placeholder="e.g. 8"
                    required
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tasks */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Tasks Completed <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="tasks"
                  value={form.tasks}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Describe the tasks you completed today..."
                  required
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Learnings */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Key Learnings <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="learning"
                  value={form.learning}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="What did you learn today?"
                  required
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Remarks */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Remarks <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="Any additional notes or observations..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <CheckSquare size={15} />}
                  {submitting ? 'Saving...' : 'Save Report'}
                </motion.button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(INITIAL_FORM); }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filters ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <TabBar active={filter} onChange={setFilter} />
        <p className="text-sm text-slate-400">
          {isLoading ? 'Loading...' : `${reports.length} report${reports.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* ── Reports Grid ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={36} className="animate-spin text-blue-500" />
        </div>
      ) : reports.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {reports.map((r, i) => (
            <ReportCard key={r._id} report={r} studentName={studentName} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default StudentProgressReports;
