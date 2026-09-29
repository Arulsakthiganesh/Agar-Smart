import React, { useState } from 'react';
import { WeatherMap } from '../map/WeatherMap';
import { MapTimeline, TimeStep } from '../map/MapTimeline';
import { DashboardSummary } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { Layers, Sliders, Eye, Wind, Thermometer, Droplets, Gauge, Compass, ShieldAlert, Crosshair } from 'lucide-react';

interface LiveNowcastMapPageProps {
  summary: DashboardSummary | null;
}

export const LiveNowcastMapPage: React.FC<LiveNowcastMapPageProps> = ({ summary }) => {
  const [timeStep, setTimeStep] = useState<TimeStep>('NOW');
  const [selectedCell, setSelectedCell] = useState<any>(null);

  const [variables, setVariables] = useState({
    thunderstormProb: true,
    lightningProb: true,
    rainfall: false,
    wind: true,
    temperature: false,
    humidity: false,
    radarReflectivity: true,
    satellite: true,
  });

  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const cells = summary?.active_storm_cells || [];
  const strikes = summary?.latest_lightning_strikes || [];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Crosshair className="text-blue-400" size={20} /> FULL-SCREEN OPERATIONAL GIS NOWCASTING MAP
          </h2>
          <p className="text-xs text-gray-400">High-resolution spatio-temporal weather grid prediction & radar overlay</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Risk Threshold:</span>
          {['ALL', 'MODERATE', 'HIGH', 'SEVERE'].map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-2.5 py-1 rounded text-xs font-bold tracking-wider transition-all ${
                riskFilter === r
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-[#111827] text-gray-400 border border-[#1F2937] hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left Controls & Variables Sidebar */}
        <div className="lg:col-span-3 bg-[#111827] border border-[#1F2937] rounded-xl p-4 flex flex-col justify-between space-y-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="border-b border-[#1F2937] pb-2 font-bold text-xs uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Sliders size={16} className="text-blue-400" /> Forecast Layer Variables
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2 rounded bg-[#0D111D] border border-[#1F2937] cursor-pointer hover:border-gray-700">
                <span className="text-gray-200 font-medium">Thunderstorm Probability</span>
                <input
                  type="checkbox"
                  checked={variables.thunderstormProb}
                  onChange={(e) => setVariables({ ...variables, thunderstormProb: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-[#0D111D] border border-[#1F2937] cursor-pointer hover:border-gray-700">
                <span className="text-gray-200 font-medium">Lightning Strike Probability</span>
                <input
                  type="checkbox"
                  checked={variables.lightningProb}
                  onChange={(e) => setVariables({ ...variables, lightningProb: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-700 text-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-[#0D111D] border border-[#1F2937] cursor-pointer hover:border-gray-700">
                <span className="text-gray-200 font-medium">Radar Reflectivity (dBZ)</span>
                <input
                  type="checkbox"
                  checked={variables.radarReflectivity}
                  onChange={(e) => setVariables({ ...variables, radarReflectivity: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-700 text-red-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-[#0D111D] border border-[#1F2937] cursor-pointer hover:border-gray-700">
                <span className="text-gray-200 font-medium">Satellite Cloud IR Layer</span>
                <input
                  type="checkbox"
                  checked={variables.satellite}
                  onChange={(e) => setVariables({ ...variables, satellite: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-700 text-purple-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-[#0D111D] border border-[#1F2937] cursor-pointer hover:border-gray-700">
                <span className="text-gray-200 font-medium">Surface Wind Vectors</span>
                <input
                  type="checkbox"
                  checked={variables.wind}
                  onChange={(e) => setVariables({ ...variables, wind: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-700 text-cyan-500"
                />
              </label>
            </div>

            {/* Selected Grid Cell Inspector Panel */}
            <div className="border-t border-[#1F2937] pt-3 space-y-2">
              <div className="font-bold text-xs uppercase tracking-wider text-gray-300 flex items-center justify-between">
                <span>Selected Grid Telemetry</span>
                <span className="text-[10px] text-blue-400 font-mono">0.05° SPATIAL GRID</span>
              </div>

              <div className="bg-[#0D111D] border border-[#1F2937] p-3 rounded-lg text-xs space-y-2 font-mono">
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">LOCATION:</span>
                  <span className="text-white font-bold">Chennai Urban Sector</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">THUNDERSTORM PROB:</span>
                  <span className="text-blue-400 font-bold">88%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">LIGHTNING PROB:</span>
                  <span className="text-amber-400 font-bold">82%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MODEL CONFIDENCE:</span>
                  <span className="text-emerald-400 font-bold">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">WIND STEERING:</span>
                  <span className="text-gray-200">SW @ 22.0 km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TEMPERATURE / HUMIDITY:</span>
                  <span className="text-gray-200">32.4°C / 86%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 font-mono border-t border-[#1F2937] pt-2">
            NOWCAST HORIZON: 0 to 60 MIN • IMD DWR SYNCHRONIZED
          </div>
        </div>

        {/* Map Center Area */}
        <div className="lg:col-span-9 flex flex-col gap-2 h-full">
          <div className="flex-1 min-h-0">
            <WeatherMap
              stormCells={cells}
              lightningStrikes={strikes}
              timeStep={timeStep}
              activeLayers={{
                thunderstormProb: variables.thunderstormProb,
                lightningProb: variables.lightningProb,
                stormCells: true,
                lightningStrikes: true,
                radarReflectivity: variables.radarReflectivity,
                windVectors: variables.wind,
                riskZones: true
              }}
            />
          </div>
          <MapTimeline currentStep={timeStep} onStepChange={setTimeStep} />
        </div>
      </div>
    </div>
  );
};
