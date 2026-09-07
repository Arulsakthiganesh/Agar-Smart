import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map, Box, Building2, Layers, Hash, Pipette, ShieldAlert, Cpu,
  TrendingUp, ArrowUpRight, CheckCircle2, Activity, Clock
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { fetchDashboardStats, fetchRecentActivity } from '../services/api';
import { DashboardStats, ActivityLog } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    total_parcels: 12486,
    mapped_3d_properties: 8942,
    total_buildings: 4231,
    floors_mapped: 18720,
    ulpins_generated: 11382,
    underground_assets: 1286,
    validation_issues: 147,
    ai_processing_jobs: 24,
  });
  const [activity, setActivity] = useState<ActivityLog[]>([]);

  useEffect(() => {
    fetchDashboardStats().then(setStats);
    fetchRecentActivity().then(setActivity);
  }, []);

  // Time series chart data
  const timeSeriesData = [
    { month: 'Jan 26', ulpins: 2400, properties3D: 1800, aiScans: 120 },
    { month: 'Feb 26', ulpins: 3800, properties3D: 2900, aiScans: 240 },
    { month: 'Mar 26', ulpins: 5200, properties3D: 4100, aiScans: 360 },
    { month: 'Apr 26', ulpins: 7400, properties3D: 5800, aiScans: 490 },
    { month: 'May 26', ulpins: 9200, properties3D: 7200, aiScans: 610 },
    { month: 'Jun 26', ulpins: 11382, properties3D: 8942, aiScans: 840 },
  ];

  // Property type chart data
  const propertyTypeData = [
    { name: 'Residential', count: 6840, fill: '#3b82f6' },
    { name: 'Commercial', count: 2410, fill: '#06b6d4' },
    { name: 'Mixed Use', count: 1850, fill: '#10b981' },
    { name: 'Infrastructure', count: 1386, fill: '#f59e0b' },
  ];

  const kpiCards = [
    { label: 'Total Parcels', value: stats.total_parcels.toLocaleString(), icon: Map, color: 'from-blue-600 to-blue-400', link: '/parcels' },
    { label: '3D Mapped Properties', value: stats.mapped_3d_properties.toLocaleString(), icon: Box, color: 'from-cyan-500 to-teal-400', link: '/map3d', highlight: true },
    { label: 'Buildings', value: stats.total_buildings.toLocaleString(), icon: Building2, color: 'from-indigo-600 to-blue-500', link: '/buildings' },
    { label: 'Floors Mapped', value: stats.floors_mapped.toLocaleString(), icon: Layers, color: 'from-sky-500 to-cyan-400', link: '/floors-units' },
    { label: 'ULPINs Generated', value: stats.ulpins_generated.toLocaleString(), icon: Hash, color: 'from-emerald-500 to-teal-400', link: '/ulpin' },
    { label: 'Underground Assets', value: stats.underground_assets.toLocaleString(), icon: Pipette, color: 'from-amber-500 to-orange-400', link: '/underground' },
    { label: 'Validation Issues', value: stats.validation_issues.toLocaleString(), icon: ShieldAlert, color: 'from-rose-600 to-pink-500', link: '/validation' },
    { label: 'AI Processing Jobs', value: stats.ai_processing_jobs.toLocaleString(), icon: Cpu, color: 'from-purple-600 to-indigo-500', link: '/ai-analysis' },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-sans flex items-center gap-2">
            Land Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Volumetric Cadastre & 3D ULPIN GIS Overview • Ministry of Rural Development
          </p>
        </div>

        <button
          onClick={() => navigate('/map3d')}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Box size={16} /> Open 3D Spatial Viewer
        </button>
      </div>

      {/* KPI Cards Grid (8 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              onClick={() => navigate(kpi.link)}
              className={`p-4 bg-[#0f172a]/80 border rounded-2xl cursor-pointer transition-all duration-200 group hover:-translate-y-1 ${
                kpi.highlight
                  ? 'border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon size={18} />
                </div>
                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 block">{kpi.label}</span>
              <span className="text-xl font-extrabold text-white font-sans mt-0.5 block tracking-tight">
                {kpi.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: ULPIN & 3D Cadastre Growth */}
        <div className="lg:col-span-2 p-5 bg-[#0f172a]/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-400" /> 3D Cadastral Mapping Progress
              </h3>
              <p className="text-[11px] text-slate-400">Cumulative 3D ULPIN generation and volumetric mapping growth</p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              +38.4% MoM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUlpins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="color3D" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="ulpins" name="ULPINs Generated" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUlpins)" strokeWidth={2} />
                <Area type="monotone" dataKey="properties3D" name="3D Properties Mapped" stroke="#06b6d4" fillOpacity={1} fill="url(#color3D)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Type Distribution Bar Chart */}
        <div className="p-5 bg-[#0f172a]/80 border border-slate-800 rounded-2xl">
          <h3 className="font-bold text-sm text-slate-100 mb-1">Property Type Distribution</h3>
          <p className="text-[11px] text-slate-400 mb-4">Breakdown of mapped vertical cadastre units</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Cadastral Activity Stream */}
      <div className="p-5 bg-[#0f172a]/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Activity size={16} className="text-cyan-400" /> Recent Activity Stream
          </h3>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={14} /> Live Sync
          </span>
        </div>

        <div className="space-y-3">
          {activity.map((act) => (
            <div key={act.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-3 hover:bg-slate-800/60 transition-colors text-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <CheckCircle2 size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between font-semibold text-slate-200">
                  <span>{act.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-400 mt-0.5 leading-snug">{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
