import React from 'react';
import { DashboardSummary, NowcastPrediction } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { CloudRain, Compass, Gauge, Activity, ShieldAlert, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ThunderstormPageProps {
  summary: DashboardSummary | null;
  predictions: NowcastPrediction[];
}

const PROBABILITY_TIME_DATA = [
  { time: 'NOW (0m)', prob: 78, confidence: 92, dbz: 48 },
  { time: '+15m', prob: 88, confidence: 94, dbz: 55 },
  { time: '+30m', prob: 94, confidence: 91, dbz: 58 },
  { time: '+45m', prob: 85, confidence: 88, dbz: 52 },
  { time: '+60m', prob: 72, confidence: 85, dbz: 44 },
];

export const ThunderstormPage: React.FC<ThunderstormPageProps> = ({ summary }) => {
  const cells = summary?.active_storm_cells || [];

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      <div>
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <CloudRain className="text-blue-400" size={20} /> THUNDERSTORM NOWCASTING & CONVECTIVE ANALYSIS
        </h2>
        <p className="text-xs text-gray-400">Multi-horizon temporal probability curves & storm cell tracking</p>
      </div>

      {/* METRIC BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl">
          <div className="text-xs text-gray-400 uppercase font-semibold">Active Storm Cell Count</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{cells.length} Active Cells</div>
          <div className="text-[11px] text-blue-400 mt-1">Convective initiation active</div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl">
          <div className="text-xs text-gray-400 uppercase font-semibold">Average Reflectivity</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">48.5 dBZ</div>
          <div className="text-[11px] text-gray-400 mt-1">Moderate-to-Heavy Echoes</div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl">
          <div className="text-xs text-gray-400 uppercase font-semibold">Maximum Peak Reflectivity</div>
          <div className="text-2xl font-bold text-red-500 mt-1 font-mono">58.5 dBZ</div>
          <div className="text-[11px] text-red-400 mt-1">Severe Hail & Microburst Risk</div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl">
          <div className="text-xs text-gray-400 uppercase font-semibold">Steering Vector Flow</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">NE @ 22 km/h</div>
          <div className="text-[11px] text-emerald-400 mt-1">Consistent propagation</div>
        </div>
      </div>

      {/* PROBABILITY TIME CHART */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-400" /> Thunderstorm Probability Curve (15m, 30m, 45m, 60m Horizon)
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            CONV-XGB MODEL PROJECTION
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PROBABILITY_TIME_DATA}>
              <defs>
                <linearGradient id="probColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} stroke="#9CA3AF" tick={{ fontSize: 12 }} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                itemStyle={{ color: '#F3F4F6' }}
              />
              <Area type="monotone" dataKey="prob" name="Thunderstorm Prob (%)" stroke="#3B82F6" fillOpacity={1} fill="url(#probColor)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* STORM CELL CARDS GRID */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">
          Tracked Storm Cell Directory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cells.map((cell) => (
            <div key={cell.id} className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-3 hover:border-gray-700 transition-all shadow-lg">
              <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                <span className="font-mono font-bold text-base text-white">{cell.cell_code}</span>
                <RiskBadge level={cell.severity_level} />
              </div>

              <div className="text-xs text-gray-400 font-mono">
                Lat {cell.latitude.toFixed(4)}° N • Lon {cell.longitude.toFixed(4)}° E
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#0D111D] p-2 rounded border border-[#1F2937]">
                  <span className="text-gray-500 text-[10px] uppercase block">Reflectivity</span>
                  <span className="font-bold text-red-400">{cell.intensity_dbz} dBZ</span>
                </div>

                <div className="bg-[#0D111D] p-2 rounded border border-[#1F2937]">
                  <span className="text-gray-500 text-[10px] uppercase block">Probability</span>
                  <span className="font-bold text-blue-400">{Math.round(cell.thunderstorm_prob * 100)}%</span>
                </div>

                <div className="bg-[#0D111D] p-2 rounded border border-[#1F2937]">
                  <span className="text-gray-500 text-[10px] uppercase block">Vector Movement</span>
                  <span className="font-bold text-gray-200">{cell.direction_cardinal} @ {cell.speed_kmh}km/h</span>
                </div>

                <div className="bg-[#0D111D] p-2 rounded border border-[#1F2937]">
                  <span className="text-gray-500 text-[10px] uppercase block">AI Confidence</span>
                  <span className="font-bold text-emerald-400">{Math.round(cell.confidence * 100)}%</span>
                </div>
              </div>

              <div className="text-[10px] text-gray-500 font-mono text-right">
                Updated {new Date(cell.detected_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
