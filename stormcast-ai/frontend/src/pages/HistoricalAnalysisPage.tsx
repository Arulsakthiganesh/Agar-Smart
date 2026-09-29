import React, { useState } from 'react';
import { History, Filter, Calendar, MapPin, BarChart3, TrendingUp, Play } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HISTORICAL_MONTHLY_DATA = [
  { month: 'May 2025', storms: 24, lightning: 4120, severeCount: 8 },
  { month: 'Jun 2025', storms: 38, lightning: 7850, severeCount: 14 },
  { month: 'Jul 2025', storms: 45, lightning: 9420, severeCount: 19 },
  { month: 'Aug 2025', storms: 52, lightning: 11200, severeCount: 22 },
  { month: 'Sep 2025', storms: 41, lightning: 8300, severeCount: 16 },
];

export const HistoricalAnalysisPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Chennai Coastal Sector');

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      <div>
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <History className="text-blue-400" size={20} /> HISTORICAL STORM & SEVERE WEATHER ARCHIVE ANALYSIS
        </h2>
        <p className="text-xs text-gray-400">Multi-year convective storm trajectory, flash density & climatological trends</p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-400" />
            <span className="text-gray-400 font-semibold">Date Range:</span>
            <input
              type="date"
              defaultValue="2025-05-01"
              className="bg-[#0D111D] border border-[#1F2937] px-2.5 py-1.5 rounded text-white font-mono"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              defaultValue="2025-09-30"
              className="bg-[#0D111D] border border-[#1F2937] px-2.5 py-1.5 rounded text-white font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-amber-400" />
            <span className="text-gray-400 font-semibold">Location Sector:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-[#0D111D] border border-[#1F2937] px-2.5 py-1.5 rounded text-white font-mono"
            >
              <option value="Chennai Coastal Sector">Chennai Coastal Sector</option>
              <option value="Bengaluru Electronic City">Bengaluru Electronic City</option>
              <option value="Hyderabad Sector">Hyderabad Sector</option>
              <option value="Machilipatnam Delta">Machilipatnam Delta</option>
            </select>
          </div>
        </div>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold font-mono shadow-lg transition-all flex items-center gap-2">
          <Filter size={14} /> APPLY ARCHIVE FILTER
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl">
          <div className="text-xs text-gray-400 uppercase font-semibold">Total Archive Storms</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">200 Events</div>
          <div className="text-[11px] text-gray-400 mt-1">2025 Monsoonal Archive</div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl">
          <div className="text-xs text-gray-400 uppercase font-semibold">Total Recorded Strikes</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">40,890 Flashes</div>
          <div className="text-[11px] text-amber-400 mt-1">Peak in July/August</div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl">
          <div className="text-xs text-gray-400 uppercase font-semibold">Max Recorded Prob</div>
          <div className="text-2xl font-bold text-red-500 mt-1 font-mono">98.4%</div>
          <div className="text-[11px] text-red-400 mt-1">Supercell initiation</div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl">
          <div className="text-xs text-gray-400 uppercase font-semibold">Average Storm Duration</div>
          <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">1hr 45min</div>
          <div className="text-[11px] text-blue-400 mt-1">Mean cell lifespan</div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl">
          <div className="text-xs text-gray-400 uppercase font-semibold">Total Affected Area</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">14,200 sq km</div>
          <div className="text-[11px] text-emerald-400 mt-1">South India Corridor</div>
        </div>
      </div>

      {/* HISTORICAL FREQUENCY CHART */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-400" /> Historical Storm Frequency & Lightning Distribution (Monthly)
          </h3>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
            IMD CLIMATOLOGICAL DATABASE
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={HISTORICAL_MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }} />
              <Bar dataKey="storms" name="Total Storm Cells" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="severeCount" name="Severe Warning Events" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
