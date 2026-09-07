import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Info } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex font-sans">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* Official Data Disclaimer Footer Bar */}
        <footer className="bg-slate-950 border-t border-slate-800/80 py-2.5 px-6 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-cyan-400 shrink-0" />
            <p className="truncate text-[11px]">
              <strong className="text-slate-300">DISCLAIMER:</strong> BHUMI³D is a prototype developed for Smart India Hackathon 2026 (SIH26011). Demonstration data and 3D ULPIN logic are fictional and must not be treated as official government land records.
            </p>
          </div>
          <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-4">
            DoLR • Ministry of Rural Development
          </span>
        </footer>
      </div>
    </div>
  );
};
