import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [email, setEmail] = useState('admin@bhumi3d.gov.in');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('officer')) {
      setUser({ id: 2, name: 'Rajesh Kumar (DoLR Officer)', email: email, role: 'govt_officer' }, 'jwt_token_officer');
    } else if (email.includes('surveyor')) {
      setUser({ id: 3, name: 'Suresh Nathan (Senior Surveyor)', email: email, role: 'surveyor' }, 'jwt_token_surveyor');
    } else {
      setUser({ id: 1, name: 'Admin Officer', email: 'admin@bhumi3d.gov.in', role: 'administrator' }, 'jwt_token_admin');
    }
    navigate('/');
  };

  const setDemoRole = (roleEmail: string, pass: string) => {
    setEmail(roleEmail);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0f172a]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl z-10 relative">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center font-extrabold text-2xl text-white shadow-xl shadow-blue-500/25 mb-3">
            B³D
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
            BHUMI<sup className="text-cyan-400 font-extrabold text-lg">3D</sup>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            3D ULPIN & Vertical Property Intelligence Platform  
            <span className="block font-medium text-cyan-400/90 mt-0.5">Department of Land Resources (DoLR)</span>
          </p>
        </div>

        {/* Quick Demo Account Selector */}
        <div className="mb-6 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block mb-2 text-center">
            Select Demo Account Role:
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setDemoRole('admin@bhumi3d.gov.in', 'admin123')}
              className={`py-1.5 px-2 rounded-xl font-medium transition-all text-center ${
                email.includes('admin') ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Administrator
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('officer@bhumi3d.gov.in', 'officer123')}
              className={`py-1.5 px-2 rounded-xl font-medium transition-all text-center ${
                email.includes('officer') ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Govt Officer
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('surveyor@bhumi3d.gov.in', 'surveyor123')}
              className={`py-1.5 px-2 rounded-xl font-medium transition-all text-center ${
                email.includes('surveyor') ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              GIS Surveyor
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="name@bhumi3d.gov.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="text-cyan-400 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all group"
          >
            <span>Sign In to Cadastral Portal</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-[11px] text-slate-400">
          SIH 2026 Problem Statement: <span className="text-slate-300 font-mono font-semibold">SIH26011</span>
        </div>
      </div>
    </div>
  );
};
