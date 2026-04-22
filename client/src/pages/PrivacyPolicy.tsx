import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Cookie, Users, Mail } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const SectionCard = ({ icon, title, children, delay = 0 }: { icon: React.ReactNode; title: string; children: React.ReactNode; delay?: number }) => (
  <motion.div {...fadeUp} transition={{ duration: 0.5, delay }} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">{icon}</div>
      <h2 className="text-xl font-bold text-slate-900 pt-2">{title}</h2>
    </div>
    <div className="text-slate-600 leading-relaxed space-y-3 ml-16">{children}</div>
  </motion.div>
);

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/20 text-blue-300 text-sm font-medium mb-6 border border-blue-500/20">
              <Shield size={16} className="mr-2" /> Your Privacy Matters
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Policy</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-2xl mx-auto text-lg text-slate-300">
            We are committed to protecting your personal information and your right to privacy.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-sm text-slate-400 mt-4">
            Last updated: April 22, 2026
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <SectionCard icon={<Shield className="text-accent" size={24} />} title="1. Introduction">
            <p>Welcome to the OJT Management System, operated by students of Ratan Tata Maharashtra State Skills University (RT-MSSU), Pune. This Privacy Policy describes how we collect, use, store, and protect your personal information.</p>
            <p>By using the Platform, you agree to the collection and use of information in accordance with this policy.</p>
          </SectionCard>

          <SectionCard icon={<Eye className="text-emerald-500" size={24} />} title="2. Information We Collect" delay={0.05}>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Personal Identification:</strong> Full name, email address, phone number, and profile photograph.</li>
              <li><strong>Academic Information:</strong> University name, department, enrollment number, year of study, and academic data.</li>
              <li><strong>Professional Information:</strong> Skills, resume/CV, work experience, and OJT preferences.</li>
              <li><strong>Account Credentials:</strong> Username and encrypted password for authentication.</li>
              <li><strong>Usage Data:</strong> IP address, browser type, pages visited, and diagnostic data.</li>
              <li><strong>Communication Data:</strong> Messages sent through support or contact features.</li>
            </ul>
          </SectionCard>

          <SectionCard icon={<Users className="text-amber-500" size={24} />} title="3. How We Use Your Information" delay={0.1}>
            <p>We use collected information to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Create, manage, and maintain your user account.</li>
              <li>Facilitate the OJT placement process by matching students with opportunities.</li>
              <li>Enable coordinators to review applications and monitor student progress.</li>
              <li>Allow recruiters to post opportunities and review applications.</li>
              <li>Generate reports and analytics for academic and administrative purposes.</li>
              <li>Communicate updates, notifications, and platform announcements.</li>
              <li>Improve Platform functionality, user experience, and security.</li>
            </ul>
          </SectionCard>

          <SectionCard icon={<Lock className="text-purple-500" size={24} />} title="4. Data Protection & Security" delay={0.15}>
            <p>We implement industry-standard security measures including:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Encryption:</strong> Passwords are hashed using bcrypt before storage.</li>
              <li><strong>Secure Transmission:</strong> Data is protected using HTTPS/TLS protocols.</li>
              <li><strong>Access Control:</strong> Role-based access control (RBAC) ensures users access only role-relevant data.</li>
              <li><strong>Regular Backups:</strong> Database backups are performed regularly.</li>
            </ul>
            <p>No method of electronic transmission is 100% secure, but we maintain the highest practical standards.</p>
          </SectionCard>

          <SectionCard icon={<Cookie className="text-orange-500" size={24} />} title="5. Cookies & Tracking" delay={0.2}>
            <p>Our Platform may use cookies to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Remember your login session and preferences.</li>
              <li>Analyze usage patterns for performance improvements.</li>
              <li>Provide a personalized user experience.</li>
            </ul>
            <p>You may disable cookies through browser settings. We do not use cookies for advertising or third-party tracking.</p>
          </SectionCard>

          <SectionCard icon={<Users className="text-red-500" size={24} />} title="6. Third-Party Sharing" delay={0.25}>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>We do not sell</strong> your personal information to third parties.</li>
              <li><strong>We do not rent or trade</strong> your data with external agencies.</li>
              <li>Data is shared only with authorized Platform users as part of the OJT workflow.</li>
              <li>We may disclose information if required by law or legal process.</li>
            </ul>
          </SectionCard>

          <SectionCard icon={<Mail className="text-accent" size={24} />} title="7. Contact Us" delay={0.3}>
            <p>For questions about this Privacy Policy, contact us:</p>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mt-2">
              <p className="font-semibold text-slate-800">OJT Management System — Privacy Team</p>
              <p className="text-sm mt-1">Email: <a href="mailto:support@mssu.ac.in" className="text-accent hover:underline">support@mssu.ac.in</a></p>
              <p className="text-sm">Phone: +91 98765 43210</p>
              <p className="text-sm">Address: RT-MSSU, Pune, Maharashtra, India</p>
            </div>
          </SectionCard>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
