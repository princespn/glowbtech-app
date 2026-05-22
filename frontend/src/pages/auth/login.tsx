import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ShieldAlert } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Mock API call simulation - connects directly to your auth.ts endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Invalid validation keys.');
      }

      // Save token securely inside local cache structure
      localStorage.setItem('glowbtech_token', data.token);
      navigate('/checkout'); // Direct transition to secure route
    } catch (err: any) {
      setError(err.message || 'Server network communication failed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] px-6 py-12">
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative subtle backdrop light effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-2">Initialize your secure developer dashboard token.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl mb-6 animate-in fade-in duration-200">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System Email</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-500"><Mail size={18} /></span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-200 pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Access Password</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-500"><Lock size={18} /></span>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-200 pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all mt-2 shadow-lg shadow-blue-600/10"
          >
            <LogIn size={16} /> Authenticate Session
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-500">
          New to the ecosystem?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}