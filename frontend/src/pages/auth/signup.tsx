import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, ShieldCheck, ShieldAlert, User, Phone } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function Signup() {
  // 🌟 Clean State Definitions
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setLoading(false);
      return setError('Access keys configurations do not match.');
    }

    try {
      // 🚀 PURE AXIOS POST IMPLEMENTATION: Object directly parsed without stringify wraps
      const response = await axiosClient.post('/users/register', {
        name,
        email,
        mobile,
        password
      });

      const data = response.data;

      if (!data || !data.success) {
        throw new Error(data.message || 'Registration cycle rejected.');
      }

      // 🌟 Local Storage Data Anchoring for Route Guard Authorization Checklist
      if (data.token) {
        localStorage.setItem('glowbtech_token', data.token);
      }
      localStorage.setItem('glowbtech_user_id', data.glowbtech_user_id);
      
      // Auto-route execution to the checkout line
      navigate('/checkout');
    } catch (err: any) {
      // Extract specific deep nested messages directly from our Express controller error maps
      const errorMsg = err.response?.data?.message || err.message || 'Server environment pipeline error.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] px-6 py-12">
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden text-left">
        
        {/* Decorative subtle backdrop light effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">Register Node</h2>
          <p className="text-slate-400 text-sm mt-2">Create your central enterprise master identity record.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl mb-6 animate-in fade-in duration-200">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          
          {/* Column 1: Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-500"><User size={18} /></span>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Amit Sharma" 
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Column 2: Mobile Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-500"><Phone size={18} /></span>
              <input 
                type="tel" 
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 99999 XXXXX" 
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Column 3: Corporate Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Corporate Email</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-500"><Mail size={18} /></span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Column 4: Secure Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Secure Password</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-500"><Lock size={18} /></span>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters" 
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Column 5: Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-500"><ShieldCheck size={18} /></span>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type access password" 
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Action Trigger Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all mt-2 shadow-lg shadow-emerald-600/10 ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <UserPlus size={16} /> {loading ? 'Processing Node...' : 'Register Identity'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            Authorize Here
          </Link>
        </div>
      </div>
    </div>
  );
}