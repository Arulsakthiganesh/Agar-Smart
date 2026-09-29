import React, { useState } from 'react';
import { Satellite, Eye, RefreshCw, AlertCircle, Layers, ShieldCheck } from 'lucide-react';

export const SatellitePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'IR' | 'VIS' | 'WV'>('IR');

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      <div>
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Satellite className="text-purple-400" size={20} /> INSAT-3D / 3DR SATELLITE CONVECTIVE INTELLIGENCE
        </h2>
        <p className="text-xs text-gray-400">Multi-spectral cloud top temperature & deep convection initiation spotter</p>
      </div>

      {/* METADATA BAR */}
      <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-gray-400 block text-[10px]">SATELLITE PLATFORM</span>
            <span className="font-bold text-white text-sm">INSAT-3DR</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">CURRENT SPECTRUM</span>
            <span className="font-bold text-purple-400 text-sm">
              {activeTab === 'IR' ? 'Infrared (10.8 µm)' : activeTab === 'VIS' ? 'Visible (0.65 µm)' : 'Water Vapor (6.7 µm)'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">SPATIAL RESOLUTION</span>
            <span className="font-bold text-gray-200 text-sm">4.0 KM Grid</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">MIN CLOUD TOP TEMP</span>
            <span className="font-bold text-red-400 text-sm">-68.4 °C (Deep Convection)</span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-[#0D111D] p-1 rounded-lg border border-[#1F2937]">
          {(['IR', 'VIS', 'WV'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-xs font-bold font-mono transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'IR' ? 'INFRARED (IR)' : tab === 'VIS' ? 'VISIBLE (VIS)' : 'WATER VAPOR (WV)'}
            </button>
          ))}
        </div>
      </div>

      {/* SATELLITE CANVAS DISPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
            <span className="text-xs font-bold text-white font-mono uppercase">
              MOSDAC INSAT-3DR {activeTab} SPECTRUM SCAN
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              SIMULATION / DEMO DATA MODE
            </span>
          </div>

          <div className="relative w-full h-[440px] bg-[#060A12] rounded-lg border border-[#1F2937] overflow-hidden flex items-center justify-center">
            {/* Simulated Satellite Cloud Layer Pattern */}
            <div className={`absolute w-[420px] h-[320px] rounded-full blur-2xl opacity-60 ${
              activeTab === 'IR' ? 'bg-purple-600' : activeTab === 'VIS' ? 'bg-gray-200' : 'bg-cyan-600'
            }`}></div>
            <div className="absolute w-[240px] h-[180px] rounded-full bg-red-600/80 blur-xl"></div>
            <div className="absolute w-[120px] h-[90px] rounded-full bg-white blur-md animate-pulse"></div>

            {/* Convective Initiation Detection Box */}
            <div className="absolute border-2 border-dashed border-red-500 p-4 rounded-lg bg-red-950/40 text-xs font-mono text-white space-y-1">
              <div className="font-bold text-red-400 flex items-center gap-1">
                <AlertCircle size={14} /> AI CONVECTIVE SPOTTER
              </div>
              <div>Cloud Top Temp: -68.4°C</div>
              <div>Initiation Risk: SEVERE</div>
            </div>
          </div>
        </div>

        {/* AI Cloud Convective Spotter Details */}
        <div className="lg:col-span-4 bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-4">
          <div className="border-b border-[#1F2937] pb-2 font-bold text-xs uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" /> AI Convective Overshooting Top Detection
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#0D111D] border border-[#1F2937] rounded-lg space-y-1">
              <span className="text-gray-400 block text-[10px] uppercase">DETECTED REGION</span>
              <span className="font-bold text-white font-mono text-sm">Chennai & Bay of Bengal Arc</span>
              <p className="text-gray-400 text-[11px] pt-1">Rapid cloud-top cooling observed (-2.4°C / 5 min). Indicates severe updraft core strength.</p>
            </div>

            <div className="p-3 bg-[#0D111D] border border-[#1F2937] rounded-lg space-y-1">
              <span className="text-gray-400 block text-[10px] uppercase">WATER VAPOR BRIGHTNESS TEMP DIFFERENCE</span>
              <span className="font-bold text-amber-400 font-mono text-sm">+3.2 °C (BTD Positive)</span>
              <p className="text-gray-400 text-[11px] pt-1">Overshooting cloud top penetrating tropopause into lower stratosphere.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
