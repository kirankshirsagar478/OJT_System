import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Building, CheckCircle, TrendingUp } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900"></div>
          {/* Decorative background pattern could go here */}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
          >
            Bridge the Gap Between <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Campus and Corporate
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-10"
          >
            A centralized On-Job Training management platform that seamlessly connects students, institutions, and recruiters to formalize career development.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/register" className="w-full sm:w-auto px-8 py-3 bg-accent text-white rounded-lg font-medium text-lg hover:bg-blue-600 transition shadow-lg hover:shadow-xl flex items-center justify-center">
              Get Started <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-medium text-lg hover:bg-white/20 transition flex items-center justify-center">
              Login to Portal
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Platform Capabilities</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to orchestrate a successful internship and OJT ecosystem in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<BookOpen className="text-accent" size={32} />}
              title="For Students"
              description="Build your profile, browse verified opportunities, and track your application status up to graduation."
              delay={0}
            />
            <FeatureCard 
              icon={<Building className="text-emerald-500" size={32} />}
              title="For Recruiters"
              description="Publish openings, review skill-matched profiles, and seamlessly onboard fresh talent."
              delay={0.1}
            />
            <FeatureCard 
              icon={<CheckCircle className="text-amber-500" size={32} />}
              title="For Coordinators"
              description="Review applications, approve OJT starts, and monitor attendance and performance reports."
              delay={0.2}
            />
            <FeatureCard 
              icon={<TrendingUp className="text-purple-500" size={32} />}
              title="Insights & Analytics"
              description="Data-driven dashboards providing full visibility into placement rates and organizational impact."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Stats/CTA Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Join thousands accelerating their careers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-4xl font-extrabold text-accent">5K+</div>
              <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Students</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-accent">500+</div>
              <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Companies</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-accent">2K+</div>
              <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Internships</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-accent">98%</div>
              <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Success Rate</div>
            </div>
          </div>
          <Link to="/register" className="btn-primary px-8 py-3 text-lg">
            Create Your Account Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
  >
    <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default Landing;
