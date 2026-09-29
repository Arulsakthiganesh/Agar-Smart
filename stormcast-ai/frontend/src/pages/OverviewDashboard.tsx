import React, { useState } from 'react';
import { KpiCard } from '../components/KpiCard';
import { RiskBadge } from '../components/RiskBadge';
import { WeatherMap } from '../map/WeatherMap';
import { MapTimeline, TimeStep } from '../map/MapTimeline';
import { DashboardSummary, NowcastPrediction } from '../types';
import { ShieldAlert, Zap, CloudRain, Activity, ArrowUpRight, Compass, Gauge, AlertTriangle, Layers } from 'lucide-react';

interface OverviewDashboardProps {
  summary: DashboardSummary | null;
  predictions: NowcastPrediction[];
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ summary, predictions }) => {
  const [timeStep, setTimeStep] = useState<TimeStep>('NOW');
  const [activeLayers, setActiveLayers] = useState({
    thunderstormProb: true,
    lightningProb: true,
    stormCells: true,
    lightningStrikes: true,
    radarReflectivity: true,
    windVectors: true,
    riskZones: true,
  });

  const cells = summary?.active_storm_cells || [];
  const strikes = summary?.latest_lightning_strikes || [];
  const alerts = summary?.recent_alerts || [];

  const topCell = cells[0] || {
    cell_code: 'CELL-001',
    thunderstorm_prob: 0.88,
    lightning_prob: 0.82,
    direction_cardinal: 'NE',
    speed_kmh: 22,
    intensity_dbz: 54.5,
    confidence: 0.92,
    severity_level: 'SEVERE'
  };

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Storm Cells"
          value={summary?.active_storm_cells_count ?? 12}
          subtext="Tracked by Chennai & Bengaluru DWR"
          trend="+3 from 15 min ago"
          icon={CloudRain}
          colorClass="text-blue-400"
        />
        <KpiCard
          title="Lightning Events"
          value={summary?.lightning_events_60m_count ?? 428}
          subtext="Last 60 min flash count"
          trend="Peak activity detected"
          icon={Zap}
          colorClass="text-amber-400"
        />
        <KpiCard
          title="High-Risk Zones"
          value={summary?.high_risk_zones_count ?? 7}
          subtext={`${summary?.critical_risk_zones_count ?? 2} Critical Emergency Warnings`}
          trend="Escalating convective risk"
          icon={ShieldAlert}
          colorClass="text-red-400"
        />
        <KpiCard
          title="Predicted Events"
          value={summary?.predicted_events_count ?? 16}
          subtext="Next 15m to 60m Forecast Horizon"
          trend="92% AI Model Confidence"
          icon={Activity}
          colorClass="text-emerald-400"
        />
      </div>

      {/* MAIN MAP CONTAINER & RIGHT NOWCAST PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[640px]">
        {/* Map Column */}
        <div className="lg:col-span-9 flex flex-col gap-2 h-full">
          {/* Layer Quick Toggles */}
          <div className="flex items-center justify-between bg-[#111827] border border-[#1F2937] px-3 py-2 rounded-lg text-xs">
            <div className="flex items-center gap-2 font-semibold text-gray-300">
              <Layers size={16} className="text-blue-400" />
              <span>Map Layers:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers.stormCells}
                  onChange={(e) => setActiveLayers({ ...activeLayers, stormCells: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-0"
                />
                <span className="text-gray-300">Storm Cells</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers.lightningStrikes}
                  onChange={(e) => setActiveLayers({ ...activeLayers, lightningStrikes: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-700 text-amber-500 focus:ring-0"
                />
                <span className="text-gray-300">Lightning Strikes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers.radarReflectivity}
                  onChange={(e) => setActiveLayers({ ...activeLayers, radarReflectivity: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-700 text-red-500 focus:ring-0"
                />
                <span className="text-gray-300">Radar Reflectivity (dBZ)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers.riskZones}
                  onChange={(e) => setActiveLayers({ ...activeLayers, riskZones: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-700 text-purple-500 focus:ring-0"
                />
                <span className="text-gray-300">Risk Zones</span>
              </label>
            </div>
          </div>

          {/* Interactive GIS Map */}
          <div className="flex-1 min-h-0">
            <WeatherMap
              stormCells={cells}
              lightningStrikes={strikes}
              timeStep={timeStep}
              activeLayers={activeLayers}
            />
          </div>

          {/* Map Scrubbable Timeline */}
          <MapTimeline currentStep={timeStep} onStepChange={setTimeStep} />
        </div>

        {/* Right NOWCAST Operational Panel */}
        <div className="lg:col-span-3 bg-[#111827] border border-[#1F2937] rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">NOWCAST TARGET</span>
              <RiskBadge level={topCell.severity_level as any} />
            </div>

            <div className="text-sm font-bold text-white font-mono mb-1">
              Chennai Coastal & Urban Sector
            </div>
            <div className="text-xs text-gray-400 mb-4">
              Lat: 13.0827° N • Lon: 80.2707° E
            </div>

            {/* Probability Gauges */}
            <div className="space-y-3 mb-4">
              <div className="bg-[#0D111D] border border-[#1F2937] p-3 rounded-lg">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-400 font-medium">THUNDERSTORM PROBABILITY</span>
                  <span className="font-bold text-blue-400">{Math.round(topCell.thunderstorm_prob * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${topCell.thunderstorm_prob * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#0D111D] border border-[#1F2937] p-3 rounded-lg">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-400 font-medium">LIGHTNING PROBABILITY</span>
                  <span className="font-bold text-amber-400">{Math.round(topCell.lightning_prob * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${topCell.lightning_prob * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Storm Movement & Intensity Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0D111D] p-2.5 rounded-lg border border-[#1F2937]">
                <span className="text-gray-400 block text-[10px] uppercase">STORM MOVEMENT</span>
                <span className="font-bold text-gray-200 flex items-center gap-1 mt-0.5">
                  <Compass size={14} className="text-blue-400" />
                  {topCell.direction_cardinal} {topCell.speed_kmh} km/h
                </span>
              </div>

              <div className="bg-[#0D111D] p-2.5 rounded-lg border border-[#1F2937]">
                <span className="text-gray-400 block text-[10px] uppercase">REFLECTIVITY INTENSITY</span>
                <span className="font-bold text-red-400 flex items-center gap-1 mt-0.5">
                  <Gauge size={14} />
                  {topCell.intensity_dbz} dBZ
                </span>
              </div>

              <div className="bg-[#0D111D] p-2.5 rounded-lg border border-[#1F2937]">
                <span className="text-gray-400 block text-[10px] uppercase">AI CONFIDENCE</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">
                  {Math.round(topCell.confidence * 100)}%
                </span>
              </div>

              <div className="bg-[#0D111D] p-2.5 rounded-lg border border-[#1F2937]">
                <span className="text-gray-400 block text-[10px] uppercase">NEXT 30 MIN RISK</span>
                <span className="font-bold text-red-500 uppercase mt-0.5 block">
                  HIGH CONVECTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="border-t border-[#1F2937] pt-3">
            <button className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all">
              <AlertTriangle size={16} />
              ISSUE EMERGENCY WARNING BULLETIN
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 3 PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Panel 1: Active Alerts */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <ShieldAlert size={16} className="text-red-400" /> Active Weather Warnings
            </h3>
            <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded font-mono font-bold">
              {alerts.length} CRITICAL
            </span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {alerts.slice(0, 3).map((a) => (
              <div key={a.id} className="p-3 bg-[#0D111D] border border-red-900/40 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-red-400">{a.alert_code}</span>
                  <RiskBadge level={a.severity} />
                </div>
                <p className="text-gray-300 text-[11px] font-medium leading-relaxed">{a.message}</p>
                <div className="text-[10px] text-gray-500 flex justify-between pt-1">
                  <span>Issued: {new Date(a.created_at).toLocaleTimeString()}</span>
                  <span className="text-blue-400 cursor-pointer hover:underline">View on Map &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Storm Cell Tracking */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <CloudRain size={16} className="text-blue-400" /> Storm Cell Tracking
            </h3>
            <span className="text-[10px] text-gray-400 font-mono">4 CELLS LIVE</span>
          </div>
          <div className="overflow-x-auto max-h-48">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-[10px] uppercase text-gray-500 border-b border-[#1F2937]">
                <tr>
                  <th className="pb-1.5 font-semibold">Cell Code</th>
                  <th className="pb-1.5 font-semibold">Severity</th>
                  <th className="pb-1.5 font-semibold">Prob</th>
                  <th className="pb-1.5 font-semibold">Vector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937] text-[11px]">
                {cells.map((cell) => (
                  <tr key={cell.id} className="hover:bg-[#1F2937]/40">
                    <td className="py-2 font-mono font-bold text-blue-400">{cell.cell_code}</td>
                    <td className="py-2"><RiskBadge level={cell.severity_level} /></td>
                    <td className="py-2 font-bold text-gray-200">{Math.round(cell.thunderstorm_prob * 100)}%</td>
                    <td className="py-2 text-gray-400">{cell.direction_cardinal} @ {cell.speed_kmh}km/h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel 3: Recent Lightning Activity */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Zap size={16} className="text-amber-400" /> Recent Lightning Strikes
            </h3>
            <span className="text-[10px] text-amber-400 font-mono font-bold">REAL-TIME FEED</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {strikes.slice(0, 4).map((st) => (
              <div key={st.id} className="flex items-center justify-between p-2 bg-[#0D111D] border border-[#1F2937] rounded-md text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Zap size={14} className={st.type === 'CG' ? 'text-red-400' : 'text-amber-400'} />
                  <div>
                    <span className="text-gray-200 font-bold">{st.type === 'CG' ? 'Cloud-to-Ground' : 'Intra-Cloud'}</span>
                    <span className="text-[10px] text-gray-500 block">Lat {st.latitude.toFixed(2)}° Lon {st.longitude.toFixed(2)}°</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-red-400 font-bold">{st.polarity}{st.peak_current_ka} kA</span>
                  <span className="text-[10px] text-gray-500 block">{new Date(st.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
