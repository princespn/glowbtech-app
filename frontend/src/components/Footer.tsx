import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-400">
        <div>
          <h3 className="font-bold text-white mb-4 text-base tracking-wider">GLOWBTECH</h3>
          <p className="leading-relaxed">Architecting automated, high-precision software engines and production integrations since 2011.</p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-200 mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/category/all" className="hover:text-blue-400 transition-colors">All Architecture Profiles</Link></li>
            <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-200 mb-4">Support Ecosystem</h4>
          <p>Need custom Zoho Flow or corporate system integrations? Reach out at our central operations desk.</p>
        </div>
      </div>
      <div className="text-center py-6 text-xs text-slate-600 border-t border-slate-900">
        © 2026 GlowbTech AI Solutions. Engineered with absolute system logic.
      </div>
    </footer>
  );
}