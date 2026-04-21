const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">OJT Platform</span>
            </div>
            <p className="text-sm text-slate-400">
              Connecting students with industry opportunities. A seamless way to manage and track On-Job Training.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">For Students</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition">Browse Opportunities</a></li>
              <li><a href="#" className="hover:text-accent transition">Career Resources</a></li>
              <li><a href="#" className="hover:text-accent transition">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition">Post Opportunities</a></li>
              <li><a href="#" className="hover:text-accent transition">Find Talent</a></li>
              <li><a href="#" className="hover:text-accent transition">Partnership Program</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent transition">Contact Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} OJT Management System. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <span>Built with MERN Stack</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
