const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load Models
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const Company = require('./models/Company');
const Opportunity = require('./models/Opportunity');
const Application = require('./models/Application');
const OJTProgress = require('./models/OJTProgress');
const AuditLog = require('./models/AuditLog');

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/ojt_system');
    console.log('Connected.');

    console.log('Clearing old data...');
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      Company.deleteMany({}),
      Opportunity.deleteMany({}),
      Application.deleteMany({}),
      OJTProgress.deleteMany({}),
      AuditLog.deleteMany({})
    ]);
    const rawPassword = '123456';
    const hashedPassword = await bcrypt.hash('123456', 10);

    console.log('Creating Admin & Coordinator...');
    const admin = await User.create({ fullName: 'System Admin', email: 'admin@test.com', password: rawPassword, role: 'admin', accountStatus: 'active' });
    const coord = await User.create({ fullName: 'University Coordinator', email: 'coord@test.com', password: rawPassword, role: 'coordinator', accountStatus: 'active' });

    console.log('Creating Recruiters and Companies...');
    const rec1 = await User.create({ fullName: 'Alice HR', email: 'alice@techcorp.com', password: rawPassword, role: 'recruiter', accountStatus: 'active' });
    const rec2 = await User.create({ fullName: 'Bob Recruiter', email: 'bob@innovate.io', password: rawPassword, role: 'recruiter', accountStatus: 'active' });
    
    // Unverified recruiter for testing
    const rec3 = await User.create({ fullName: 'Eve Startup', email: 'eve@newstartup.com', password: rawPassword, role: 'recruiter', accountStatus: 'active' });

    const company1 = await Company.create({
      userId: rec1._id, companyName: 'TechCorp Solutions', industryType: 'Software Development',
      location: 'San Francisco, CA', hrName: 'Alice HR', hrEmail: 'alice@techcorp.com',
      verificationStatus: 'verified'
    });
    
    const company2 = await Company.create({
      userId: rec2._id, companyName: 'Innovate AI Labs', industryType: 'Information Technology',
      location: 'Austin, TX', hrName: 'Bob Recruiter', hrEmail: 'bob@innovate.io',
      verificationStatus: 'verified'
    });

    const company3 = await Company.create({
      userId: rec3._id, companyName: 'Future Web', industryType: 'Web Design',
      location: 'Remote', hrName: 'Eve Startup', hrEmail: 'eve@newstartup.com',
      verificationStatus: 'pending'
    });

    console.log('Creating Students...');
    const stu1 = await User.create({ fullName: 'John Doe', email: 'john@student.edu', password: rawPassword, role: 'student', accountStatus: 'active' });
    const stu2 = await User.create({ fullName: 'Jane Smith', email: 'jane@student.edu', password: rawPassword, role: 'student', accountStatus: 'active' });
    const stu3 = await User.create({ fullName: 'Mike Johnson', email: 'mike@student.edu', password: rawPassword, role: 'student', accountStatus: 'active' });

    await StudentProfile.create({
      userId: stu1._id, enrollmentNo: 'STU2021001', department: 'Computer Science',
      year: 'Final Year', cgpa: 8.5, skills: ['React', 'Node.js', 'TypeScript']
    });
    await StudentProfile.create({
      userId: stu2._id, enrollmentNo: 'STU2021002', department: 'Software Engineering',
      year: 'Final Year', cgpa: 9.1, skills: ['Python', 'Machine Learning', 'SQL']
    });
    await StudentProfile.create({
      userId: stu3._id, enrollmentNo: 'STU2021003', department: 'Information Technology',
      year: '3rd Year', cgpa: 7.8, skills: ['HTML', 'CSS', 'JavaScript', 'Tailwind']
    });

    console.log('Creating Opportunities...');
    const opp1 = await Opportunity.create({
      companyId: company1._id, title: 'Frontend Developer Intern',
      description: 'Looking for a passionate frontend developer intern to help build beautiful UIs in React.',
      requiredSkills: ['React', 'CSS', 'JavaScript'], stipend: '$1000/mo', duration: '6 Months',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), status: 'open'
    });

    const opp2 = await Opportunity.create({
      companyId: company1._id, title: 'Backend Software Intern',
      description: 'Join our infrastructure team to scale cutting-edge Node.js environments and MongoDB integrations.',
      requiredSkills: ['Node.js', 'MongoDB', 'Express'], stipend: '$1200/mo', duration: '6 Months',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), status: 'open'
    });

    const opp3 = await Opportunity.create({
      companyId: company2._id, title: 'Data Science OJT Trainee',
      description: 'Analyze complex datasets and build initial ML models for predictive insights.',
      requiredSkills: ['Python', 'SQL', 'TensorFlow'], stipend: '$1500/mo', duration: '3 Months',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), status: 'closed' // Simulate a closed one
    });

    const opp4 = await Opportunity.create({
      companyId: company2._id, title: 'UI/UX Design Intern',
      description: 'Work alongside senior product designers to refine Figma prototypes and conduct user research.',
      requiredSkills: ['Figma', 'Prototyping', 'User Research'], stipend: 'Unpaid', duration: '3 Months',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), status: 'open'
    });

    console.log('Creating Applications & Progress...');
    
    // John applied to Frontend Intern and got Approved -> Active OJT
    const app1 = await Application.create({
      opportunityId: opp1._id, studentId: stu1._id, status: 'approved',
      appliedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), remarks: 'Great react portfolio.'
    });
    
    // Jane applied to Data Science and got Approved but completed it
    const app2 = await Application.create({
      opportunityId: opp3._id, studentId: stu2._id, status: 'approved',
      appliedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), remarks: 'Strong thesis.'
    });

    // Mike applied to Frontend and is Shortlisted (Needs Coordinator Approval)
    const app3 = await Application.create({
      opportunityId: opp1._id, studentId: stu3._id, status: 'shortlisted',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), remarks: 'Good CSS skills. Waiting on university.'
    });

    // John applied to Backend and is purely pending
    const app4 = await Application.create({
      opportunityId: opp2._id, studentId: stu1._id, status: 'pending',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });

    // Jane rejected from Backend
    const app5 = await Application.create({
      opportunityId: opp2._id, studentId: stu2._id, status: 'rejected',
      appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), remarks: 'Does not specialize in node.'
    });

    // Create OJT Progress for the approved items
    // John's Active Progress
    await OJTProgress.create({
      applicationId: app1._id, studentId: stu1._id, companyId: company1._id,
      startDate: new Date(), mentor: 'Alice HR', attendance: 100, performanceStatus: 'good'
    });

    // Jane's Completed Progress
    await OJTProgress.create({
      applicationId: app2._id, studentId: stu2._id, companyId: company2._id,
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(), mentor: 'Bob Recruiter', attendance: 95, performanceStatus: 'excellent'
    });

    console.log('Generating Audit Logs...');
    await AuditLog.create([
      { actionType: 'REGISTER', module: 'Auth', userId: admin._id, details: 'System Admin initialized' },
      { actionType: 'CREATE', module: 'Opportunity', userId: rec1._id, details: 'TechCorp Posted Frontend Intern Role' },
      { actionType: 'CREATE', module: 'Application', userId: stu1._id, details: 'John Doe applied to Frontend Developer Intern' },
      { actionType: 'UPDATE', module: 'Application', userId: rec1._id, details: 'TechCorp shortlisted John Doe' },
      { actionType: 'UPDATE', module: 'Application', userId: coord._id, details: 'University approved John Doe placement' },
    ]);

    console.log('Database successfully seeded with realistic placeholder data!');
    process.exit();
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedDB();
