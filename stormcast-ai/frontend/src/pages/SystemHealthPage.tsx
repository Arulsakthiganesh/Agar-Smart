import React from 'react';
import { SystemHealth } from '../types';
import { Activity, Cpu, Database, Server, Radio, CheckCircle2, HardDrive, Wifi, Shield } from 'lucide-react';

interface SystemHealthPageProps {
  health: SystemHealth | null;
}

export const SystemHealthPage: React.FC<SystemHealthPageProps> = ({ health }) => {
  const h = health || {
    api_status: 'ONLINE',
    database_status: 'ONLINE',
    ai_engine_status: 'ONLINE',
    websocket_status: 'ONLINE',
    data_mode: 'DEMO',
    cpu_usage_pct: 16.4,
    memory_usage_pct: 42.1,
    active_connections: 14,
    last_model_inference: new Date().toISOString(),
    providers_status: {
      Radar: 'ONLINE (DEMO)',
      Satellite: 'ONLINE (DEMO)',
      Lightning: 'ONLINE (DEMO)',
      NWP: 'ONLINE (DEMO)'
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      <div>
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Activity className="text-emerald-400" size={20} /> PLATFORM SYSTEM HEALTH & DEVOPS MONITORING
        </h2>
        <p className="text-xs text-gray-400">Microservice status, server memory/CPU load & WebSocket heartbeat telemetry</p>
      </div>

      {/* CORE STATUS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold uppercase">
            <span>FastAPI Backend</span>
            <Server size={18} className="text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {h.api_status}
          </div>
          <div className="text-[11px] text-gray-500 font-mono">Latency: 12ms • REST API v1</div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold uppercase">
            <span>PostgreSQL DB</span>
            <Database size={18} className="text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {h.database_status}
          </div>
          <div className="text-[11px] text-gray-500 font-mono">SQLite / PostGIS Spatial Index</div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold uppercase">
            <span>AI Nowcast Engine</span>
            <Cpu size={18} className="text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {h.ai_engine_status}
          </div>
          <div className="text-[11px] text-gray-500 font-mono">ConvXGB & Vector Flow Online</div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold uppercase">
            <span>WebSocket Live Stream</span>
            <Wifi size={18} className="text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {h.websocket_status}
          </div>
          <div className="text-[11px] text-gray-500 font-mono">{h.active_connections} Active Sockets</div>
        </div>
      </div>

      {/* METRICS & PROVIDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Server Resource Gauges */}
        <div className="lg:col-span-6 bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-4">
          <div className="border-b border-[#1F2937] pb-2 font-bold text-xs uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <HardDrive size={16} className="text-blue-400" /> Server Host Compute Resources
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">CPU LOAD PERCENTAGE</span>
                <span className="font-bold text-blue-400">{h.cpu_usage_pct}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${h.cpu_usage_pct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">MEMORY ALLOCATION</span>
                <span className="font-bold text-emerald-400">{h.memory_usage_pct}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${h.memory_usage_pct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Connectivity Summary */}
        <div className="lg:col-span-6 bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-3">
          <div className="border-b border-[#1F2937] pb-2 font-bold text-xs uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Radio size={16} className="text-amber-400" /> Provider Pipeline Connectivity
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            {Object.entries(h.providers_status).map(([key, val]) => (
              <div key={key} className="p-3 bg-[#0D111D] border border-[#1F2937] rounded-lg">
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">{key} Provider</span>
                <span className="font-bold text-emerald-400">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
