import React from 'react';
import { DataSourceStatus, DataMode } from '../types';
import { Database, CheckCircle2, AlertTriangle, Clock, RefreshCw, Key, Shield } from 'lucide-react';

interface DataSourcesPageProps {
  dataMode: DataMode;
  onToggleDataMode: () => void;
  sources: DataSourceStatus[];
}

export const DataSourcesPage: React.FC<DataSourcesPageProps> = ({ dataMode, onToggleDataMode, sources }) => {
  const sourceList = sources.length > 0 ? sources : [
    { id: 'ds-01', name: 'IMD Doppler Weather Radar Network', type: 'RADAR', provider: 'DemoRadarProvider', status: 'ONLINE', is_demo: true, last_ingested_at: new Date().toISOString(), latency_seconds: 3, quality_flag: 'GOOD' },
    { id: 'ds-02', name: 'MOSDAC INSAT-3DR Satellite Feed', type: 'SATELLITE', provider: 'DemoSatelliteProvider', status: 'ONLINE', is_demo: true, last_ingested_at: new Date().toISOString(), latency_seconds: 12, quality_flag: 'GOOD' },
    { id: 'ds-03', name: 'IMD Lightning Detection System (LMS)', type: 'LIGHTNING', provider: 'DemoLightningProvider', status: 'ONLINE', is_demo: true, last_ingested_at: new Date().toISOString(), latency_seconds: 1, quality_flag: 'GOOD' },
    { id: 'ds-04', name: 'IMD Numerical Weather Prediction (NWP)', type: 'NWP', provider: 'DemoWeatherProvider', status: 'ONLINE', is_demo: true, last_ingested_at: new Date().toISOString(), latency_seconds: 5, quality_flag: 'GOOD' },
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Database className="text-blue-400" size={20} /> METEOROLOGICAL DATA INGESTION & PROVIDER ADAPTERS
          </h2>
          <p className="text-xs text-gray-400">Multi-source atmospheric observational pipeline & quality control audit</p>
        </div>

        {/* Global Data Mode Switcher */}
        <button
          onClick={onToggleDataMode}
          className={`px-4 py-2 rounded-lg border font-mono text-xs font-bold tracking-wider flex items-center gap-2 shadow-lg transition-all ${
            dataMode === 'DEMO'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500 hover:bg-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500 hover:bg-emerald-500/30'
          }`}
        >
          <RefreshCw size={14} className="animate-spin" />
          ACTIVE DATA MODE: {dataMode} PROVIDERS
        </button>
      </div>

      {/* DATA SOURCES TABLE */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-3">
        <div className="border-b border-[#1F2937] pb-2 font-bold text-xs uppercase tracking-wider text-gray-300 flex items-center justify-between">
          <span>INGESTION PIPELINE STATUS</span>
          <span className="text-[10px] text-gray-400 font-mono">4 SOURCES ACTIVE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="text-[10px] uppercase text-gray-500 border-b border-[#1F2937]">
              <tr>
                <th className="pb-2 font-semibold">Data Source Name</th>
                <th className="pb-2 font-semibold">Type</th>
                <th className="pb-2 font-semibold">Provider Adapter</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Quality Flag</th>
                <th className="pb-2 font-semibold">Latency</th>
                <th className="pb-2 font-semibold">Data Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937] text-xs font-mono">
              {sourceList.map((ds) => (
                <tr key={ds.id} className="hover:bg-[#1F2937]/40">
                  <td className="py-3 font-bold text-white font-sans">{ds.name}</td>
                  <td className="py-3 text-blue-400 font-bold">{ds.type}</td>
                  <td className="py-3 text-gray-300">{ds.provider}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {ds.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                      {ds.quality_flag}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">{ds.latency_seconds} sec</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ds.is_demo ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400'
                    }`}>
                      {ds.is_demo ? 'SIMULATION' : 'REAL API'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REAL DATA INTEGRATION GUIDE BOX */}
      <div className="bg-[#0D111D] border border-[#1F2937] p-4 rounded-xl space-y-2 text-xs">
        <div className="font-bold text-white flex items-center gap-2 font-mono">
          <Key size={16} className="text-amber-400" /> REAL DATA PROVIDER CONNECTIVITY ARCHITECTURE
        </div>
        <p className="text-gray-400 leading-relaxed">
          To connect STORMCAST AI to real IMD Radar, MOSDAC INSAT-3DR satellite, or Earth Networks lightning APIs in production, configure environment variables in <code className="text-blue-400 font-mono">.env</code>:
        </p>
        <div className="bg-[#060A12] border border-[#1F2937] p-3 rounded text-[11px] font-mono text-emerald-400 space-y-1">
          <div>DATA_MODE=real</div>
          <div>RADAR_PROVIDER=imd_dwr_adapter</div>
          <div>RADAR_API_KEY=your_official_imd_dwr_api_key</div>
          <div>SATELLITE_PROVIDER=mosdac_insat3d_adapter</div>
          <div>LIGHTNING_PROVIDER=imd_lms_adapter</div>
        </div>
      </div>
    </div>
  );
};
