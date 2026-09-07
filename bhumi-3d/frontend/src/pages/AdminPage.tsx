import React from 'react';
import { Users, Activity, Database, Cpu, ShieldCheck } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const users = [
    { name: 'Admin Officer', email: 'admin@bhumi3d.gov.in', role: 'Administrator', status: 'Active' },
    { name: 'Rajesh Kumar', email: 'officer@bhumi3d.gov.in', role: 'Government Officer', status: 'Active' },
    { name: 'Suresh Nathan', email: 'surveyor@bhumi3d.gov.in', role: 'Senior GIS Surveyor', status: 'Active' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Users className="text-cyan-400" size={24} /> System Administration & User Roles
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage RBAC permissions, database connections, and API system health monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-3">
          <Database size={24} className="text-emerald-400" />
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Database Engine</span>
            <p className="font-bold text-white text-xs">SQLite / PostGIS Ready</p>
          </div>
        </div>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-3">
          <Activity size={24} className="text-cyan-400" />
          <div>
            <span className="text-[11px] text-slate-400 font-medium">API Health Status</span>
            <p className="font-bold text-emerald-400 text-xs">100% Online (FastAPI)</p>
          </div>
        </div>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-3">
          <Cpu size={24} className="text-blue-400" />
          <div>
            <span className="text-[11px] text-slate-400 font-medium">AI Processing Engine</span>
            <p className="font-bold text-white text-xs">Simulated CV/YOLO</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-[#0f172a]/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Registered System Users & Permissions</h3>
        <div className="space-y-3">
          {users.map((u, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-100">{u.name}</span>
                <p className="text-slate-400 font-mono text-[11px]">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-bold bg-blue-600/20 text-cyan-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  {u.role}
                </span>
                <span className="text-emerald-400 font-semibold">{u.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
