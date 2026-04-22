import { motion } from 'framer-motion';
import { Users, Target, Lightbulb, GraduationCap, Building2, Award } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/20 text-blue-300 text-sm font-medium mb-6 border border-blue-500/20">
              <GraduationCap size={16} className="mr-2" /> Academic Capstone Project
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
          >
            About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              OJT Platform
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-slate-300"
          >
            A comprehensive On-the-Job Training Management System developed as a Capstone Project by students of RT-MSSU, Pune.
          </motion.p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Who We Are</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-6">
                Students Building Real-World Solutions
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We are a team of dedicated students from <strong>Ratan Tata Maharashtra State Skills University (RT-MSSU), Pune</strong>. This OJT Management System has been developed as our <strong>Capstone Project</strong> for academic purposes, demonstrating our ability to design, develop, and deploy full-stack web applications that solve real-world problems.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Our team combines expertise in modern web technologies — including React, Node.js, MongoDB, and Express — to deliver a platform that meets the needs of students, coordinators, and recruiting companies alike.
              </p>
              <p className="text-slate-600 leading-relaxed">
                This project reflects our commitment to practical learning and our vision for how technology can streamline the OJT process across educational institutions in India and beyond.
              </p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-100">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                    <GraduationCap className="text-accent" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">RT-MSSU</div>
                  <div className="text-sm text-slate-500 mt-1">University</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Award className="text-emerald-500" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">Capstone</div>
                  <div className="text-sm text-slate-500 mt-1">Project Type</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-100">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Users className="text-amber-500" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">MERN</div>
                  <div className="text-sm text-slate-500 mt-1">Tech Stack</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-100">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Building2 className="text-purple-500" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">Pune</div>
                  <div className="text-sm text-slate-500 mt-1">Location</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
              Empowering the Future Workforce
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600">
              We believe that seamless OJT management is the key to bridging the gap between academic learning and industry readiness.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0 }} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-accent" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Streamline OJT Processes</h3>
              <p className="text-slate-600 leading-relaxed">
                To create a centralized platform that eliminates the inefficiencies of manual OJT management — from opportunity discovery to progress tracking — making the entire process transparent and efficient.
              </p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-emerald-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Connect All Stakeholders</h3>
              <p className="text-slate-600 leading-relaxed">
                To unify students, academic coordinators, and industry recruiters on a single platform — enabling real-time collaboration, approvals, and communication throughout the OJT lifecycle.
              </p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb className="text-amber-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Demonstrate Best Practices</h3>
              <p className="text-slate-600 leading-relaxed">
                To showcase how colleges and universities can implement a real-world OJT management platform, serving as a reference architecture for similar educational technology projects.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About the Project */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">About the Project</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
              Building a Production-Ready System
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="prose prose-slate max-w-none">
            <div className="bg-gradient-to-r from-blue-50/80 to-emerald-50/80 rounded-2xl p-8 md:p-10 border border-blue-100/50">
              <p className="text-slate-700 leading-relaxed text-lg mb-6">
                The <strong>OJT Management System</strong> is a full-stack web application designed to digitize and streamline the entire On-the-Job Training workflow for educational institutions. Built using the <strong>MERN stack</strong> (MongoDB, Express.js, React, and Node.js), the system supports four distinct user roles:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/80 rounded-xl p-5 border border-slate-200/80">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-accent"></span> Students
                  </h4>
                  <p className="text-sm text-slate-600">Browse opportunities, submit applications, track progress, and submit reports — all from a personalized dashboard.</p>
                </div>
                <div className="bg-white/80 rounded-xl p-5 border border-slate-200/80">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Recruiters
                  </h4>
                  <p className="text-sm text-slate-600">Post OJT opportunities, review student profiles, and manage the hiring pipeline with intuitive tools.</p>
                </div>
                <div className="bg-white/80 rounded-xl p-5 border border-slate-200/80">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Coordinators
                  </h4>
                  <p className="text-sm text-slate-600">Approve applications, monitor student performance, and oversee the OJT program at the institutional level.</p>
                </div>
                <div className="bg-white/80 rounded-xl p-5 border border-slate-200/80">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span> Administrators
                  </h4>
                  <p className="text-sm text-slate-600">Manage users, recruiters, and system settings with full administrative control and audit logging.</p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                This project demonstrates how educational institutions can leverage modern web technologies to create a scalable, secure, and user-friendly OJT management platform. While developed as an academic capstone project, the system has been designed with production-grade architecture, including role-based access control, responsive design, and comprehensive data management capabilities.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
