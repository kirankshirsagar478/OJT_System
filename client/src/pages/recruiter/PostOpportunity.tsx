import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const PostOpportunity = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stipend: '',
    duration: '',
    deadline: '',
    requiredSkills: '' // Will comma split
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const skillsArray = formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== '');
      const payload = {
        ...formData,
        requiredSkills: skillsArray
      };

      const res = await api.post('/recruiter/opportunity', payload);
      if (res.data.success) {
        toast.success("Opportunity posted successfully!");
        navigate('/recruiter/opportunities');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to post opportunity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/recruiter/dashboard" className="text-sm font-medium text-slate-500 hover:text-accent flex items-center mb-4 transition-colors w-fit">
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Post New Opportunity</h1>
        <p className="text-slate-500">Create a new internship or OJT position.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="label-text">Job Title <span className="text-error">*</span></label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="e.g. Frontend Developer Intern"
              />
            </div>

            <div>
              <label htmlFor="description" className="label-text">Description <span className="text-error">*</span></label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className="input-field mt-1 resize-none"
                placeholder="Describe the role, responsibilities, and what the student will learn..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="stipend" className="label-text">Stipend / Compensation</label>
                <input
                  id="stipend"
                  name="stipend"
                  type="text"
                  value={formData.stipend}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="e.g. $500/month or Unpaid"
                />
              </div>

              <div>
                <label htmlFor="duration" className="label-text">Duration</label>
                <input
                  id="duration"
                  name="duration"
                  type="text"
                  value={formData.duration}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="e.g. 3 Months, 6 Months"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="deadline" className="label-text">Application Deadline <span className="text-error">*</span></label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label htmlFor="requiredSkills" className="label-text">Required Skills (Comma separated)</label>
                <input
                  id="requiredSkills"
                  name="requiredSkills"
                  type="text"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="React, CSS, Algorithms"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
              <Link to="/recruiter/dashboard" className="btn-secondary px-6">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-8 flex justify-center items-center"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                Publish Posting
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostOpportunity;
