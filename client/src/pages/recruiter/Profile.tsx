import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Building2 } from 'lucide-react';

const RecruiterProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industryType: '',
    location: '',
    hrName: '',
    hrEmail: '',
    hrPhone: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/recruiter/profile');
      if (res.data.success) {
        setProfile(res.data.company);
        setFormData({
          companyName: res.data.company.companyName || '',
          industryType: res.data.company.industryType || '',
          location: res.data.company.location || '',
          hrName: res.data.company.hrName || '',
          hrEmail: res.data.company.hrEmail || '',
          hrPhone: res.data.company.hrPhone || ''
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
      const res = await api.put('/recruiter/profile', formData);
      if (res.data.success) {
        toast.success("Company profile updated successfully!");
        setProfile(res.data.company);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
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
        <h1 className="text-2xl font-bold text-slate-800">Company Profile</h1>
        <p className="text-slate-500">Manage your organization's details and HR contacts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Company Information</h2>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                profile?.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' : 
                profile?.verificationStatus === 'rejected' ? 'bg-red-100 text-red-700' : 
                'bg-amber-100 text-amber-700'
              }`}>
                {profile?.verificationStatus || 'Pending'}
              </span>
            </div>
            <div className="p-6">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label-text">Company Name</label>
                    <input 
                      type="text" 
                      value={formData.companyName} 
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})} 
                      required
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="label-text">Industry Type</label>
                    <input 
                      type="text" 
                      value={formData.industryType} 
                      onChange={(e) => setFormData({...formData, industryType: e.target.value})} 
                      className="input-field" 
                      placeholder="e.g. Information Technology"
                    />
                  </div>
                  <div>
                    <label className="label-text">Location</label>
                    <input 
                      type="text" 
                      value={formData.location} 
                      onChange={(e) => setFormData({...formData, location: e.target.value})} 
                      className="input-field" 
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <h3 className="text-md font-medium text-slate-800 mb-4">HR/Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Contact Name</label>
                      <input 
                        type="text" 
                        value={formData.hrName} 
                        onChange={(e) => setFormData({...formData, hrName: e.target.value})} 
                        className="input-field" 
                      />
                    </div>
                    <div>
                      <label className="label-text">Contact Phone</label>
                      <input 
                        type="tel" 
                        value={formData.hrPhone} 
                        onChange={(e) => setFormData({...formData, hrPhone: e.target.value})} 
                        className="input-field" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label-text">Contact Email (Official)</label>
                      <input 
                        type="email" 
                        value={formData.hrEmail} 
                        onChange={(e) => setFormData({...formData, hrEmail: e.target.value})} 
                        className="input-field" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button type="submit" disabled={isSaving} className="btn-primary flex items-center">
                    {isSaving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : null}
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800">Account Details</h2>
            </div>
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-blue-50 text-accent rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
                <Building2 size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-800">{profile?.userId?.fullName}</h3>
              <p className="text-sm text-slate-500 mb-6">{profile?.userId?.email}</p>
              
              <div className="bg-slate-50 p-4 rounded-lg text-left">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Account Role</p>
                <p className="text-sm font-medium text-slate-800 mb-3">Recruiter</p>
                
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Created On</p>
                <p className="text-sm font-medium text-slate-800">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
