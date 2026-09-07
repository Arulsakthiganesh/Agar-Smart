import React from 'react';
import { Settings, Info, ShieldCheck, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="text-slate-400" size={24} /> System Settings & Official Guidelines
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure spatial datum standards, 3D render precision, and municipal parameters.</p>
      </div>

      <div className="p-6 bg-[#0f172a]/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl text-xs">
        <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Geospatial Configuration</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Default Coordinate Reference System (CRS):</span>
            <span className="font-mono text-cyan-400 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">EPSG:4326 (WGS84)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Vertical Datum Standard:</span>
            <span className="font-mono text-slate-200 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">Mean Sea Level (MSL) Elevation</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">ULPIN Checksum Algorithm:</span>
            <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">MD5 Hash Check Digit Mod36</span>
          </div>
        </div>
      </div>

      {/* Official Disclaimer Card */}
      <div className="p-6 bg-slate-900/90 border border-blue-500/30 rounded-3xl space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <Info size={18} /> Official Government Disclaimer
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          "BHUMI³D is a prototype developed for Smart India Hackathon 2026 (Problem Statement ID: SIH26011). Demonstration data and prototype ULPIN logic are fictional and must not be treated as official government land records."
        </p>
      </div>
    </div>
  );
};
