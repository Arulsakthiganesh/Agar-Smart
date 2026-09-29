import React, { useState } from 'react';
import { DashboardSummary, RadarStation } from '../types';
import { Radio, Activity, RefreshCw, Play, Pause, Layers, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface RadarPageProps {
  summary: DashboardSummary | null;
  radars: RadarStation[];
}

export const RadarPage: React.FC<RadarPageProps> = ({ summary, radars }) => {
  const [selectedRadar, setSelectedRadar] = useState<string>('CHN-DWR');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const radarList = radars.length > 0 ? radars : [
    { id: 'rad-001', station_code: 'CHN-DWR', name: 'Chennai Doppler Radar', latitude: 13.0827, longitude: 80.2707, elevation_m: 45, status: 'ONLINE', max_range_km: 250, last_scan_at: new Date().toISOString(), is_demo: true },
    { id: 'rad-002', station_code: 'BLR-DWR', name: 'Bengaluru Radar Station', latitude: 12.9716, longitude: 77.5946, elevation_m: 920, status: 'ONLINE', max_range_km: 250, last_scan_at: new Date().toISOString(), is_demo: true },
    { id: 'rad-003', station_code: 'HYD-DWR', name: 'Hyderabad Radar Station', latitude: 17.3850, longitude: 78.4867, elevation_m: 540, status: 'OFFLINE', max_range_km: 250, last_scan_at: new Date().toISOString(), is_demo: true },
    { id: 'rad-004', station_code: 'MPT-DWR', name: 'Machilipatnam Coastal DWR', latitude: 16.1800, longitude: 81.1300, elevation_m: 15, status: 'ONLINE', max_range_km: 250, last_scan_at: new Date().toISOString(), is_demo: true }
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      <div>
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Radio className="text-red-400" size={20} /> DOPPLER WEATHER RADAR NETWORK INTELLIGENCE
        </h2>
        <p className="text-xs text-gray-400">Multi-station reflectivity, velocity & convective echo tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Radar Station Selector */}
        <div className="lg:col-span-4 bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-3">
          <div className="border-b border-[#1F2937] pb-2 font-bold text-xs uppercase tracking-wider text-gray-300 flex items-center justify-between">
            <span>RADAR NETWORK STATIONS</span>
            <span className="text-[10px] text-amber-400 font-mono">DEMO PROVIDER MODE</span>
          </div>

          <div className="space-y-2">
            {radarList.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedRadar(st.station_code)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  selectedRadar === st.station_code
                    ? 'bg-blue-600/20 border-blue-500/60 shadow-lg'
                    : 'bg-[#0D111D] border-[#1F2937] hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-sm text-white">{st.station_code}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                    st.status === 'ONLINE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}>
                    {st.status === 'ONLINE' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                    {st.status}
                  </span>
                </div>
                <div className="text-xs text-gray-300 font-medium">{st.name}</div>
                <div className="text-[10px] text-gray-500 font-mono mt-1 flex justify-between">
                  <span>Range: {st.max_range_km} km</span>
                  <span>Elevation: {st.elevation_m}m</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Radar Reflectivity Sweep Visualizer */}
        <div className="lg:col-span-8 bg-[#111827] border border-[#1F2937] rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
            <div>
              <span className="text-xs font-bold text-white font-mono uppercase">TARGET: {selectedRadar} SCAN SWEEP</span>
              <span className="text-[10px] text-gray-400 block font-mono">250 KM RADIUS SCAN • REFLECTIVITY (dBZ)</span>
            </div>

            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg"
            >
              {isAnimating ? <Pause size={14} /> : <Play size={14} />}
              <span>{isAnimating ? 'PAUSE RADAR ANIMATION' : 'PLAY dBZ SWEEP'}</span>
            </button>
          </div>

          {/* Radar Radar Screen Mockup */}
          <div className="relative w-full h-[400px] bg-[#070B12] rounded-lg border border-[#1F2937] overflow-hidden flex items-center justify-center">
            {/* Concentric Radar Distance Rings */}
            <div className="absolute w-[350px] h-[350px] border border-emerald-900/40 rounded-full"></div>
            <div className="absolute w-[250px] h-[250px] border border-emerald-900/40 rounded-full"></div>
            <div className="absolute w-[150px] h-[150px] border border-emerald-900/40 rounded-full"></div>
            <div className="absolute w-[50px] h-[50px] border border-emerald-900/40 rounded-full"></div>

            {/* Radar Crosshairs */}
            <div className="absolute w-full h-[1px] bg-emerald-900/30"></div>
            <div className="absolute h-full w-[1px] bg-emerald-900/30"></div>

            {/* Simulated Radar Convective Reflectivity Echo Blob */}
            <div className={`absolute top-[28%] right-[32%] w-32 h-32 rounded-full bg-red-600/60 blur-xl ${isAnimating ? 'animate-ping' : ''}`}></div>
            <div className="absolute top-[32%] right-[35%] w-16 h-16 rounded-full bg-purple-600/80 blur-md"></div>

            {/* Animated Sweep Line */}
            {isAnimating && (
              <div className="absolute w-1/2 h-1/2 top-0 right-0 bg-gradient-to-br from-emerald-500/20 to-transparent origin-bottom-left animate-radar-sweep pointer-events-none"></div>
            )}

            <div className="absolute top-3 left-3 bg-[#0D111D]/90 border border-gray-800 p-2 rounded text-[11px] font-mono space-y-1">
              <div>MAX REFLECTIVITY: <span className="text-red-400 font-bold">58.5 dBZ</span></div>
              <div>ECHO TOP: <span className="text-blue-400 font-bold">14.2 KM</span></div>
              <div>MESOCYCLONE ROTATION: <span className="text-amber-400 font-bold">WEAK</span></div>
            </div>
          </div>

          {/* dBZ Scale Legend Bar */}
          <div className="bg-[#0D111D] border border-[#1F2937] p-3 rounded-lg space-y-1">
            <div className="text-[10px] font-mono uppercase text-gray-400 font-bold">
              Reflectivity Scale (dBZ)
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono">
              <span>0 dBZ</span>
              <div className="h-4 flex-1 rounded overflow-hidden flex">
                <div className="flex-1 bg-[#040817] flex items-center justify-center text-[9px] text-gray-400">0</div>
                <div className="flex-1 bg-cyan-600 flex items-center justify-center text-[9px]">10</div>
                <div className="flex-1 bg-green-500 flex items-center justify-center text-[9px] text-black">20</div>
                <div className="flex-1 bg-yellow-400 flex items-center justify-center text-[9px] text-black font-bold">30</div>
                <div className="flex-1 bg-orange-500 flex items-center justify-center text-[9px] text-black font-bold">40</div>
                <div className="flex-1 bg-red-600 flex items-center justify-center text-[9px] font-bold">50</div>
                <div className="flex-1 bg-purple-600 flex items-center justify-center text-[9px] font-bold">60+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
