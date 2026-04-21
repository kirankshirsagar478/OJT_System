import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { User } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    enrollmentNo: '',
    department: '',
    year: '',
    cgpa: 0,
    skills: '' // Will split by comma
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/student/profile');
      if (res.data.success) {
        setProfile(res.data.profile);
        setFormData({
          enrollmentNo: res.data.profile.enrollmentNo || '',
          department: res.data.profile.department || '',
          year: res.data.profile.year || '',
          cgpa: res.data.profile.cgpa || 0,
          skills: res.data.profile.skills?.join(', ') || ''
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
      const res = await api.put('/student/profile', {
        ...formData,
        skills: skillsArray
      });
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setProfile(res.data.profile);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async () => {
    if (!resumeFile) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append('resume', resumeFile);

    try {
      const res = await api.post('/student/upload-resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success("Resume uploaded successfully");
        setProfile({ ...profile, resumeLink: res.data.resumeLink });
        setResumeFile(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Student Profile</h1>
        <p className="text-slate-500">Manage your personal information and resume.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800">Profile Details</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Full Name</label>
                    <input type="text" disabled value={profile?.userId?.fullName || ''} className="input-field bg-slate-50 text-slate-500" />
                  </div>
                  <div>
                    <label className="label-text">Email</label>
                    <input type="email" disabled value={profile?.userId?.email || ''} className="input-field bg-slate-50 text-slate-500" />
                  </div>
                  <div>
                    <label className="label-text">Enrollment No.</label>
                    <input 
                      type="text" 
                      value={formData.enrollmentNo} 
                      onChange={(e) => setFormData({...formData, enrollmentNo: e.target.value})} 
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="label-text">Department</label>
                    <input 
                      type="text" 
                      value={formData.department} 
                      onChange={(e) => setFormData({...formData, department: e.target.value})} 
                      className="input-field" 
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div>
                    <label className="label-text">Year</label>
                    <input 
                      type="text" 
                      value={formData.year} 
                      onChange={(e) => setFormData({...formData, year: e.target.value})} 
                      className="input-field" 
                      placeholder="e.g. 3rd Year"
                    />
                  </div>
                  <div>
                    <label className="label-text">CGPA</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="10" 
                      value={formData.cgpa} 
                      onChange={(e) => setFormData({...formData, cgpa: parseFloat(e.target.value)})} 
                      className="input-field" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="label-text">Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.skills} 
                    onChange={(e) => setFormData({...formData, skills: e.target.value})} 
                    className="input-field" 
                    placeholder="React, Node.js, Python, TypeScript"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button type="submit" disabled={isSaving} className="btn-primary flex items-center">
                    {isSaving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : null}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800">Resume Upload</h2>
            </div>
            <div className="p-6 text-center">
              {profile?.resumeLink ? (
                <div className="mb-4">
                  <div className="w-16 h-16 bg-blue-50 text-accent rounded-full flex items-center justify-center mx-auto mb-2">
                    <User size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-800">Resume uploaded</p>
                  <a href={`http://localhost:5000${profile.resumeLink}`} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline mt-1 inline-block">
                    View Current Resume
                  </a>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User size={24} />
                  </div>
                  <p className="text-sm text-slate-500">No resume uploaded yet</p>
                </div>
              )}
              
              <div className="mt-4">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-accent hover:file:bg-blue-100 mb-4"
                />
                <button 
                  onClick={handleFileUpload} 
                  disabled={!resumeFile || uploading}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600 mr-2"></div> : null}
                  {profile?.resumeLink ? 'Update Resume' : 'Upload Resume'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
