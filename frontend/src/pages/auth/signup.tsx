import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Access keys configurations do not match.');
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Registration cycle rejected.');
      }

      localStorage.setItem('glowbtech_token', data.token);
      navigate('/checkout');
    } catch (err: any) {
      setError(err.message || 'Server environment pipeline error.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] px-6 py-12">
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        
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

          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all mt-2 shadow-lg shadow-emerald-600/10"
          >
            <UserPlus size={16} /> Register Identity
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