import React from 'react';
import { ThreeDViewer } from '../components/ThreeDViewer';
import { Box, Info, Sparkles } from 'lucide-react';

export const Map3DPage: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Top Banner Info */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl">
        <div className="flex items-center gap-2 text-xs">
          <span className="p-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles size={16} />
          </span>
          <div>
            <span className="font-bold text-slate-100">Volumetric 3D Cadastre Engine</span>
            <span className="text-slate-400 ml-2">• Click any floor or unit apartment to inspect 3D ULPIN air-rights & spatial boundaries.</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-cyan-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          EPSG:4326 (WGS84) + MSL Height
        </div>
      </div>

      {/* 3D Viewer Container */}
      <ThreeDViewer />
    </div>
  );
};
