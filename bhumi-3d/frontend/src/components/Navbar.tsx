import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Bell, User, ShieldCheck, LogOut, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Chennai, Tamil Nadu');

  const notifications = [
    { id: 1, title: 'ULPIN Generated', text: 'IN-TN-CHN-ADY-00482-B03-F07-U21-X7 issued for Unit A-703', time: '5m ago', type: 'success' },
    { id: 2, title: 'Topology Conflict', text: '3 air-rights height variances flagged in Adyar Zone 4', time: '22m ago', type: 'warning' },
    { id: 3, title: 'AI Extraction Complete', text: 'Drone scan ingested with 96.4% confidence score', time: '1h ago', type: 'info' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/parcels?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRoleSwitch = (role: 'administrator' | 'govt_officer' | 'surveyor') => {
    if (role === 'administrator') {
      setUser({ id: 1, name: 'Admin Officer', email: 'admin@bhumi3d.gov.in', role: 'administrator' });
    } else if (role === 'govt_officer') {
      setUser({ id: 2, name: 'Rajesh Kumar (DoLR)', email: 'officer@bhumi3d.gov.in', role: 'govt_officer' });
    } else {
      setUser({ id: 3, name: 'Suresh Nathan (Surveyor)', email: 'surveyor@bhumi3d.gov.in', role: 'surveyor' });
    }
  };

  return (
    <header className="h-16 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-72 md:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Property, ULPIN, Survey No, Owner..."
          className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Location Picker */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300">
          <MapPin size={15} className="text-cyan-400 shrink-0" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
          >
            <option value="Chennai, Tamil Nadu">Chennai, Tamil Nadu (Zone 13 - Adyar)</option>
            <option value="Coimbatore, Tamil Nadu">Coimbatore, Tamil Nadu (Zone 2)</option>
            <option value="Madurai, Tamil Nadu">Madurai, Tamil Nadu (Zone 1)</option>
            <option value="Bengaluru, Karnataka">Bengaluru, Karnataka (BBMP Central)</option>
          </select>
        </div>

        {/* System Online Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>System Online</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-cyan-400 rounded-full ring-2 ring-[#0f172a]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                  <Bell size={16} className="text-cyan-400" /> Notifications
                </h4>
                <span className="text-[10px] bg-blue-600/30 text-blue-400 px-2 py-0.5 rounded-full font-semibold">
                  3 Unread
                </span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors text-xs border border-slate-800">
                    <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-400 leading-snug">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Demo Role Switcher */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.name ? user.name[0] : 'A'}
          </div>

          <div className="hidden md:flex flex-col text-xs">
            <span className="font-semibold text-slate-100">{user?.name || 'Admin Officer'}</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                {user?.role || 'administrator'}
              </span>
              <span className="text-slate-400">•</span>
              <button
                onClick={() => handleRoleSwitch(user?.role === 'administrator' ? 'govt_officer' : 'administrator')}
                className="text-[10px] text-blue-400 hover:underline"
              >
                Switch
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
