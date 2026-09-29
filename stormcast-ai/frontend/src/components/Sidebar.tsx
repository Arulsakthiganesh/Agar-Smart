import React from 'react';
import { NavLink } from 'react-router-dom';

import {
  LayoutDashboard,
  Map,
  CloudRain,
  Zap,
  Radio,
  Satellite,
  AlertTriangle,
  History,
  BrainCircuit,
  Database,
  Activity,
  Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
  { path: '/live-map', label: 'Live Nowcasting Map', icon: Map },
  { path: '/thunderstorm', label: 'Thunderstorm Prediction', icon: CloudRain },
  { path: '/lightning', label: 'Lightning Monitoring', icon: Zap },
  { path: '/radar', label: 'Radar Intelligence', icon: Radio },
  { path: '/satellite', label: 'Satellite Intelligence', icon: Satellite },
  { path: '/alerts', label: 'Risk & Alert Center', icon: AlertTriangle },
  { path: '/history', label: 'Historical Analysis', icon: History },
  { path: '/ai-models', label: 'AI Model Center', icon: BrainCircuit },
  { path: '/data-sources', label: 'Data Sources', icon: Database },
  { path: '/system-health', label: 'System Health', icon: Activity },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#0D111D] border-r border-[#1F2937] flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 z-20">
      <div className="py-4 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Meteorological Modules
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#111827]'
                }`
              }
            >
              <Icon size={18} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* System Footer Status */}
      <div className="p-3 border-t border-[#1F2937] bg-[#090D16]">
        <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span>IMD NOWCAST v2.4</span>
          <span className="text-emerald-400">ONLINE</span>
        </div>
      </div>
    </aside>
  );
};
