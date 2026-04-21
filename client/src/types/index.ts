export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'student' | 'recruiter' | 'coordinator' | 'admin';
  accountStatus: 'active' | 'inactive' | 'pending';
}

export interface StudentProfile {
  _id: string;
  userId: User | string;
  enrollmentNo: string;
  department: string;
  year: string;
  cgpa: number;
  skills: string[];
  resumeLink: string;
  ojtStatus: 'not-started' | 'in-progress' | 'completed';
}

export interface Company {
  _id: string;
  userId: User | string;
  companyName: string;
  industryType: string;
  location: string;
  hrName: string;
  hrEmail: string;
  hrPhone: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface Opportunity {
  _id: string;
  companyId: Company | string;
  title: string;
  description: string;
  requiredSkills: string[];
  stipend: string;
  duration: string;
  deadline: string;
  status: 'open' | 'closed' | 'filled';
  createdAt: string;
  applicationCount?: number;
}

export interface Application {
  _id: string;
  studentId: User | string;
  opportunityId: Opportunity | string;
  resume: string;
  status: 'pending' | 'shortlisted' | 'approved' | 'rejected';
  remarks: string;
  appliedAt: string;
  createdAt: string;
}

export interface OJTProgress {
  _id: string;
  studentId: User | string;
  companyId: Company | string;
  startDate: string | null;
  endDate: string | null;
  mentor: string;
  attendance: number;
  performanceStatus: 'excellent' | 'good' | 'average' | 'poor' | 'pending';
  certificate: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}
