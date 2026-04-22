import { motion } from 'framer-motion';
import { FileText, UserCheck, ShieldAlert, Ban, Scale, Power, RefreshCw } from 'lucide-react';
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

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/20 text-blue-300 text-sm font-medium mb-6 border border-blue-500/20">
              <FileText size={16} className="mr-2" /> Legal Agreement
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Service</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-2xl mx-auto text-lg text-slate-300">
            Please read these terms carefully before using the OJT Management System.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-sm text-slate-400 mt-4">
            Effective date: April 22, 2026
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <SectionCard icon={<FileText className="text-accent" size={24} />} title="1. Acceptance of Terms">
            <p>By accessing or using the OJT Management System ("Platform"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this Platform.</p>
            <p>These Terms apply to all users of the Platform, including students, recruiters, coordinators, and administrators. Your continued use of the Platform constitutes acceptance of any modifications to these Terms.</p>
          </SectionCard>

          <SectionCard icon={<UserCheck className="text-emerald-500" size={24} />} title="2. User Responsibilities" delay={0.05}>
            <p>As a user of the Platform, you agree to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain the security of your account credentials and notify us immediately of any unauthorized access.</li>
              <li>Use the Platform only for its intended purpose — managing On-the-Job Training activities.</li>
              <li>Comply with all applicable local, state, national, and international laws and regulations.</li>
              <li>Respect the rights and privacy of other users on the Platform.</li>
              <li>Not impersonate any person or entity, or misrepresent your affiliation with any person or entity.</li>
            </ul>
          </SectionCard>

          <SectionCard icon={<ShieldAlert className="text-amber-500" size={24} />} title="3. Account Usage" delay={0.1}>
            <p>When you create an account on our Platform, you must provide information that is accurate and complete. You are solely responsible for the activity that occurs on your account, and you must keep your account password secure.</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Each user is permitted to maintain only one active account on the Platform.</li>
              <li>Account sharing between individuals is strictly prohibited.</li>
              <li>You must be affiliated with a recognized educational institution or registered organization to create an account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms without prior notice.</li>
            </ul>
          </SectionCard>

          <SectionCard icon={<Ban className="text-red-500" size={24} />} title="4. Prohibited Activities" delay={0.15}>
            <p>Users are expressly prohibited from:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Using the Platform for any unlawful, fraudulent, or malicious purpose.</li>
              <li>Attempting to gain unauthorized access to other users' accounts, data, or system infrastructure.</li>
              <li>Uploading, transmitting, or distributing malicious software, viruses, or harmful code.</li>
              <li>Scraping, data mining, or using automated tools to extract data from the Platform.</li>
              <li>Posting false, misleading, or fraudulent information, including fake OJT opportunities.</li>
              <li>Harassing, intimidating, or discriminating against other Platform users.</li>
              <li>Interfering with or disrupting the Platform's servers, networks, or services.</li>
              <li>Reproducing, distributing, or modifying the Platform's content without written permission.</li>
            </ul>
          </SectionCard>

          <SectionCard icon={<Scale className="text-purple-500" size={24} />} title="5. Limitation of Liability" delay={0.2}>
            <p>To the fullest extent permitted by applicable law:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>The Platform is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied.</li>
              <li>We do not guarantee the accuracy, completeness, or reliability of any content, including OJT opportunity listings posted by third-party recruiters.</li>
              <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.</li>
              <li>We are not responsible for any employment outcomes, decisions, or disputes between students and recruiting companies.</li>
              <li>Our total liability shall not exceed the amount you have paid to us in the twelve (12) months preceding the claim, which is zero for this free academic platform.</li>
            </ul>
          </SectionCard>

          <SectionCard icon={<Power className="text-orange-500" size={24} />} title="6. Termination of Accounts" delay={0.25}>
            <p>We reserve the right to terminate or suspend your account and access to the Platform at our sole discretion, without prior notice or liability, for any reason, including but not limited to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Violation of these Terms of Service or any applicable policies.</li>
              <li>Engagement in prohibited activities as outlined in Section 4.</li>
              <li>Providing false or misleading information during registration or use.</li>
              <li>Inactivity for an extended period (accounts may be archived after 12 months of inactivity).</li>
              <li>Request by law enforcement or government authorities.</li>
            </ul>
            <p>Upon termination, your right to use the Platform will immediately cease. All provisions which by their nature should survive termination shall survive, including intellectual property provisions and limitations of liability.</p>
          </SectionCard>

          <SectionCard icon={<RefreshCw className="text-accent" size={24} />} title="7. Changes to Terms" delay={0.3}>
            <p>We reserve the right to modify or replace these Terms of Service at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect by posting a notice on the Platform.</p>
            <p>What constitutes a material change will be determined at our sole discretion. By continuing to use the Platform after revisions become effective, you agree to be bound by the revised terms.</p>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mt-2">
              <p className="font-semibold text-slate-800">Questions about these Terms?</p>
              <p className="text-sm mt-1">Contact us at <a href="mailto:support@mssu.ac.in" className="text-accent hover:underline">support@mssu.ac.in</a></p>
            </div>
          </SectionCard>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TermsOfService;
