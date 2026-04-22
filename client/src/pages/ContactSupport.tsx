import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Headphones, Clock, MessageCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const ContactSupport = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/20 text-blue-300 text-sm font-medium mb-6 border border-blue-500/20">
              <Headphones size={16} className="mr-2" /> We're Here to Help
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Support</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-2xl mx-auto text-lg text-slate-300">
            We're here to help you with any issues related to the OJT Management System. Reach out to us and we'll respond as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0 }} className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 border border-blue-100 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Phone className="text-accent" size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Phone</h3>
              <p className="text-slate-600 font-medium">+91 98765 43210</p>
              <p className="text-sm text-slate-400 mt-2">Mon – Fri, 9:00 AM – 6:00 PM IST</p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-8 border border-emerald-100 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Mail className="text-emerald-500" size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email</h3>
              <a href="mailto:support@mssu.ac.in" className="text-slate-600 font-medium hover:text-accent transition">support@mssu.ac.in</a>
              <p className="text-sm text-slate-400 mt-2">We typically reply within 24 hours</p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-8 border border-amber-100 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                <MapPin className="text-amber-500" size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Address</h3>
              <p className="text-slate-600 font-medium">RT-MSSU, Pune</p>
              <p className="text-sm text-slate-400 mt-2">Maharashtra, India</p>
            </motion.div>
          </div>

          {/* Form + Info Grid */}
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
              <p className="text-slate-500 mb-8">Fill out the form below and our support team will get back to you shortly.</p>

              {isSubmitted && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-emerald-600" size={16} />
                  </div>
                  <p className="text-emerald-700 font-medium text-sm">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="label-text">Full Name</label>
                  <input type="text" id="contact-name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" className="input-field" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="label-text">Email Address</label>
                  <input type="email" id="contact-email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className="input-field" />
                </div>
                <div>
                  <label htmlFor="contact-message" className="label-text">Message</label>
                  <textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Describe your issue or question..." className="input-field resize-none" />
                </div>
                <button type="submit" className="btn-primary px-8 py-3 text-base flex items-center gap-2">
                  <Send size={18} /> Send Message
                </button>
              </form>
            </motion.div>

            {/* Sidebar Info */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Clock className="text-accent" size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900">Support Hours</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Monday – Friday</span>
                    <span className="font-medium text-slate-800">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Saturday</span>
                    <span className="font-medium text-slate-800">10:00 AM – 2:00 PM</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Sunday</span>
                    <span className="font-medium text-slate-500">Closed</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-3">Frequently Asked Questions</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                    How do I reset my account password?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                    How can I update my OJT progress report?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                    Who approves my OJT application?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></span>
                    How do I contact my assigned coordinator?
                  </li>
                </ul>
                <p className="text-xs text-slate-400 mt-4 border-t border-slate-700 pt-3">Can't find your answer? Send us a message using the form.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactSupport;
