import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Box, Map, Hash, Building2, Layers,
  Pipette, Cpu, UploadCloud, ShieldAlert, FileText, Settings,
  ChevronLeft, ChevronRight, Users, ExternalLink
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/map3d', label: '3D Property Map', icon: Box, highlight: true },
    { path: '/parcels', label: 'Parcel Explorer', icon: Map },
    { path: '/ulpin', label: 'ULPIN Generator', icon: Hash },
    { path: '/buildings', label: 'Buildings', icon: Building2 },
    { path: '/floors-units', label: 'Floors & Units', icon: Layers },
    { path: '/underground', label: 'Underground Assets', icon: Pipette },
    { path: '/ai-analysis', label: 'AI Geospatial', icon: Cpu },
    { path: '/upload', label: 'Data Upload', icon: UploadCloud },
    { path: '/validation', label: 'Validation', icon: ShieldAlert },
    { path: '/reports', label: 'Reports & Certs', icon: FileText },
    { path: '/admin', label: 'Administration', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-r border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 shrink-0">
            B³D
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans flex items-center gap-1">
                BHUMI<sup className="text-cyan-400 font-extrabold text-sm">3D</sup>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-cyan-400/90 -mt-1">
                DoLR Cadastre
              </span>
            </div>
          )}
        </NavLink>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav Menu Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/40 shadow-lg shadow-blue-600/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              } ${item.highlight && !isActive ? 'hover:border hover:border-cyan-500/30' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                size={20}
                className={`shrink-0 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 flex items-center justify-between">
                  {item.label}
                  {item.highlight && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  )}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-slate-200 text-xs rounded-md shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-900/40 m-2 rounded-xl text-[11px] text-slate-400">
          <div className="flex items-center justify-between font-semibold text-slate-300 mb-1">
            <span>SIH 2026</span>
            <span className="text-emerald-400 font-mono">SIH26011</span>
          </div>
          <p className="leading-tight text-slate-400">
            Ministry of Rural Development
          </p>
        </div>
      )}
    </aside>
  );
};
