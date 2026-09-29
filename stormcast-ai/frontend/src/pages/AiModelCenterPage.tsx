import React from 'react';
import { AiModelMetric } from '../types';
import { BrainCircuit, Activity, Cpu, CheckCircle2, AlertCircle, ArrowRight, Layers, Database, ShieldAlert } from 'lucide-react';

interface AiModelCenterPageProps {
  models: AiModelMetric[];
}

export const AiModelCenterPage: React.FC<AiModelCenterPageProps> = ({ models }) => {
  const modelList = models.length > 0 ? models : [
    { model_name: 'ThunderstormNowcast-ConvXGB', version: '2.1.0', training_dataset: 'IMD Historical DWR + INSAT-3D Convective Archive (2020-2025)', features: ['Radar Reflectivity (dBZ)', 'CAPE (J/kg)', 'CIN (J/kg)', '850hPa Moisture', 'VIL'], accuracy: 0.894, precision: 0.872, recall: 0.915, f1_score: 0.893, inference_time_ms: 14.2, status: 'VALIDATED' },
    { model_name: 'LightningFlash-SpatioTemporal', version: '1.4.0', training_dataset: 'IMD Lightning Sensor Network + Earth Networks Dataset', features: ['Cloud Top Temp (IR)', 'Reflectivity Height', 'Echo Top 18dBZ', 'Total Flash'], accuracy: 0.881, precision: 0.865, recall: 0.898, f1_score: 0.881, inference_time_ms: 9.8, status: 'VALIDATED' },
    { model_name: 'StormTracker-VectorFlow', version: '3.0.1', training_dataset: 'IMD Dual-Polarization Optical Flow Vectors (2022-2025)', features: ['Cross-Correlation Vector', 'Steering Wind 700hPa', 'Reflectivity Centroid Trajectory'], accuracy: 0.912, precision: 0.904, recall: 0.920, f1_score: 0.912, inference_time_ms: 11.5, status: 'VALIDATED' }
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      <div>
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <BrainCircuit className="text-emerald-400" size={20} /> AI / ML NOWCASTING MODEL CENTER & METRICS
        </h2>
        <p className="text-xs text-gray-400">Model execution engine, spatio-temporal neural pipelines & validation benchmarks</p>
      </div>

      {/* PIPELINE ARCHITECTURE VISUALIZATION */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#1F2937] pb-2 font-bold text-xs uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <Layers size={16} className="text-blue-400" /> END-TO-END NOWCASTING INFERENCE PIPELINE ARCHITECTURE
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center text-center text-xs font-mono">
          <div className="bg-[#0D111D] border border-[#1F2937] p-3 rounded-lg space-y-1">
            <Database size={18} className="mx-auto text-blue-400" />
            <div className="font-bold text-white">1. Multi-Source Ingestion</div>
            <div className="text-[10px] text-gray-400">DWR / SAT / LMS / NWP</div>
          </div>

          <div className="hidden md:flex justify-center text-gray-600"><ArrowRight size={20} /></div>

          <div className="bg-[#0D111D] border border-[#1F2937] p-3 rounded-lg space-y-1">
            <Cpu size={18} className="mx-auto text-purple-400" />
            <div className="font-bold text-white">2. Feature Engineering</div>
            <div className="text-[10px] text-gray-400">CAPE, CIN, VIL, Gradients</div>
          </div>

          <div className="hidden md:flex justify-center text-gray-600"><ArrowRight size={20} /></div>

          <div className="bg-[#0D111D] border border-emerald-500/40 p-3 rounded-lg space-y-1 bg-emerald-950/20">
            <BrainCircuit size={18} className="mx-auto text-emerald-400" />
            <div className="font-bold text-emerald-400">3. Model Inference</div>
            <div className="text-[10px] text-gray-300">ConvXGB & Vector Flow</div>
          </div>

          <div className="hidden md:flex justify-center text-gray-600"><ArrowRight size={20} /></div>

          <div className="bg-[#0D111D] border border-[#1F2937] p-3 rounded-lg space-y-1">
            <ShieldAlert size={18} className="mx-auto text-red-400" />
            <div className="font-bold text-white">4. Risk & Alert Engine</div>
            <div className="text-[10px] text-gray-400">Threshold Warning Rules</div>
          </div>
        </div>
      </div>

      {/* MODEL CARDS GRID */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">
          Deployable Model Registry & Benchmarks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modelList.map((m) => (
            <div key={m.model_name} className="bg-[#111827] border border-[#1F2937] rounded-xl p-5 space-y-4 hover:border-gray-700 transition-all shadow-lg">
              <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                <div>
                  <span className="font-mono font-bold text-sm text-white block">{m.model_name}</span>
                  <span className="text-[10px] text-blue-400 font-mono">v{m.version}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 size={10} /> {m.status}
                </span>
              </div>

              <div className="text-xs text-gray-400">
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Training Dataset</span>
                <span className="text-gray-200 font-mono">{m.training_dataset}</span>
              </div>

              {/* Performance Metrics Table */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-[#0D111D] p-2 rounded border border-[#1F2937]">
                  <span className="text-gray-500 text-[10px] uppercase block">Accuracy</span>
                  <span className="font-bold text-emerald-400">{Math.round(m.accuracy * 100)}%</span>
                </div>
                <div className="bg-[#0D111D] p-2 rounded border border-[#1F2937]">
                  <span className="text-gray-500 text-[10px] uppercase block">Precision</span>
                  <span className="font-bold text-blue-400">{Math.round(m.precision * 100)}%</span>
                </div>
                <div className="bg-[#0D111D] p-2 rounded border border-[#1F2937]">
                  <span className="text-gray-500 text-[10px] uppercase block">Recall</span>
                  <span className="font-bold text-amber-400">{Math.round(m.recall * 100)}%</span>
                </div>
                <div className="bg-[#0D111D] p-2 rounded border border-[#1F2937]">
                  <span className="text-gray-500 text-[10px] uppercase block">F1 Score</span>
                  <span className="font-bold text-purple-400">{Math.round(m.f1_score * 100)}%</span>
                </div>
              </div>

              <div className="border-t border-[#1F2937] pt-2 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>Inference Latency: <strong className="text-gray-300">{m.inference_time_ms} ms</strong></span>
                <span className="text-emerald-400 cursor-pointer hover:underline">Swap Model Baseline &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
