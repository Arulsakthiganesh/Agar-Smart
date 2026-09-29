import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="bg-[#111827]/90 backdrop-blur border border-[#1F2937] p-3 rounded-lg text-xs space-y-2.5 shadow-2xl text-gray-200 min-w-[200px]">
      <div className="font-bold text-[11px] uppercase tracking-wider text-gray-400 border-b border-[#1F2937] pb-1">
        Radar Reflectivity (dBZ)
      </div>
      <div className="flex items-center gap-1 text-[10px] font-mono">
        <span className="w-4 text-center">0</span>
        <div className="h-3 flex-1 rounded overflow-hidden flex">
          <div className="flex-1 bg-blue-900"></div>
          <div className="flex-1 bg-cyan-500"></div>
          <div className="flex-1 bg-green-500"></div>
          <div className="flex-1 bg-yellow-400"></div>
          <div className="flex-1 bg-orange-500"></div>
          <div className="flex-1 bg-red-600"></div>
          <div className="flex-1 bg-purple-600"></div>
        </div>
        <span className="w-6 text-center">60+</span>
      </div>

      <div className="font-bold text-[11px] uppercase tracking-wider text-gray-400 border-b border-[#1F2937] pb-1 pt-1">
        Risk Classification
      </div>
      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
          <span>LOW</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
          <span>MODERATE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span>
          <span>HIGH</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
          <span>SEVERE</span>
        </div>
        <div className="col-span-2 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#991B1B] animate-pulse"></span>
          <span className="font-bold text-red-400">CRITICAL CONVECTIVE</span>
        </div>
      </div>
    </div>
  );
};
