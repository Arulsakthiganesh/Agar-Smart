import React, { useState, useEffect } from 'react';
import { CloudLightning, Bell, Shield, RefreshCw, UserCheck, CheckCircle2 } from 'lucide-react';
import { DataMode } from '../types';

interface HeaderProps {
  dataMode: DataMode;
  onToggleDataMode: () => void;
  onOpenNotifications: () => void;
  activeAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  dataMode,
  onToggleDataMode,
  onOpenNotifications,
  activeAlertCount
}) => {
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-[#0D111D] border-b border-[#1F2937] px-4 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Brand & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <CloudLightning size={24} className="animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-wider text-white font-mono">STORMCAST AI</h1>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60">
              SIH 26072
            </span>
          </div>
          <p className="text-[11px] text-gray-400">AI Thunderstorm & Lightning Nowcasting • MoES / IMD</p>
        </div>
      </div>

      {/* Center: Live System Status */}
      <div className="hidden md:flex items-center gap-2 bg-[#111827] border border-[#1F2937] px-3.5 py-1.5 rounded-full">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-gray-200 tracking-wide">LIVE SYSTEM STATUS</span>
        <span className="text-gray-600">•</span>
        <span className="text-[11px] font-mono text-emerald-400">OPERATIONAL (4 RADARS)</span>
      </div>

      {/* Right: Data Mode, Timestamp, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Data Mode Switcher */}
        <button
          onClick={onToggleDataMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-bold tracking-wider transition-all ${
            dataMode === 'DEMO'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20'
          }`}
          title="Click to toggle between Demo Simulation Mode and Real Data Provider Mode"
        >
          <span className={`w-2 h-2 rounded-full ${dataMode === 'DEMO' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          MODE: {dataMode} DATA
        </button>

        {/* Timestamp */}
        <div className="hidden lg:flex flex-col text-right font-mono text-[11px] text-gray-400">
          <span className="text-gray-500">LAST UPDATED</span>
          <span className="text-gray-200 font-semibold">{timestamp}</span>
        </div>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg bg-[#111827] border border-[#1F2937] text-gray-300 hover:text-white hover:border-gray-700 transition-all"
        >
          <Bell size={18} />
          {activeAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
              {activeAlertCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#1F2937]">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-gray-300">
            <UserCheck size={16} />
          </div>
          <div className="hidden xl:flex flex-col text-left text-xs">
            <span className="font-semibold text-gray-200">Dr. A. K. Sharma</span>
            <span className="text-[10px] text-blue-400 font-mono">DUTY METEOROLOGIST</span>
          </div>
        </div>
      </div>
    </header>
  );
};
