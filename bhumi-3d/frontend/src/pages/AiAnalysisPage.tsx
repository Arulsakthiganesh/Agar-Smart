import React, { useState } from 'react';
import { runAIAnalysis } from '../services/api';
import { ProcessingJob } from '../types';
import { Cpu, UploadCloud, CheckCircle2, Sparkles, AlertCircle, ArrowRight, Layers } from 'lucide-react';

export const AiAnalysisPage: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ProcessingJob | null>({
    id: 1,
    filename: 'demo_drone_scan_adyar.jpg',
    job_type: 'Drone Image Building Extraction',
    status: 'Completed',
    progress: 100,
    result: {
      summary: {
        buildings_detected: 4,
        parcels_detected: 3,
        roads_detected: 4,
        average_confidence: 96.35,
        estimated_built_up_area_sqft: 64500,
        vertical_levels_identified: 23
      },
      pipeline_steps: [
        { name: 'Image Preprocessing & Raster Normalization', status: 'Completed', time_ms: 120 },
        { name: 'Building Footprint Extraction (YOLOv8-Geo)', status: 'Completed', confidence: 96.4 },
        { name: '2D/3D Parcel Boundary Delineation', status: 'Completed', confidence: 97.1 },
        { name: 'Vertical Floor & Unit Segmentation', status: 'Completed', confidence: 93.7 },
        { name: '3D Cadastral Topology Validation', status: 'Completed', confidence: 98.2 }
      ],
      overlay_image: ''
    },
    confidence_scores: {
      building_detection: 96.4,
      parcel_boundary: 97.1,
      floor_segmentation: 93.7,
      topology_validation: 98.2
    },
    created_at: new Date().toISOString()
  });

  const handleRunDemo = async () => {
    setAnalyzing(true);
    const formData = new FormData();
    formData.append('job_type', 'Drone Image Building Extraction');
    try {
      const res = await runAIAnalysis(formData);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="text-cyan-400" size={24} /> AI Geospatial & Building Extraction
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated computer-vision pipeline for building extraction, 2D/3D parcel segmentation & topology audit.
          </p>
        </div>

        <button
          onClick={handleRunDemo}
          disabled={analyzing}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Sparkles size={16} /> {analyzing ? 'Executing AI Extraction...' : 'Run Prototype AI Extraction Pipeline'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Upload Box & Steps */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-[#0f172a]/90 border border-slate-800 rounded-3xl text-center space-y-3 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <UploadCloud size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Upload Drone Scan / Floor Plan</h4>
              <p className="text-xs text-slate-400 mt-0.5">Supports JPG, PNG, GeoTIFF, LAS Point Cloud</p>
            </div>
            <button
              onClick={handleRunDemo}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Browse Files or Use Demo Drone Image
            </button>
          </div>

          {/* AI Pipeline Step Status */}
          {result?.result?.pipeline_steps && (
            <div className="p-5 bg-[#0f172a]/90 border border-slate-800 rounded-3xl space-y-3 shadow-xl">
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">AI Processing Pipeline Steps</h4>
              <div className="space-y-2 text-xs">
                {result.result.pipeline_steps.map((step: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">{step.name}</span>
                    <span className="text-emerald-400 font-semibold font-mono text-[11px] flex items-center gap-1">
                      <CheckCircle2 size={14} /> {step.confidence ? `${step.confidence}%` : 'Done'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Visual Overlay & Confidence Cards */}
        {result?.result?.summary && (
          <div className="lg:col-span-7 space-y-4">
            {/* Visual Canvas Overlay Preview */}
            <div className="p-4 bg-[#0f172a]/90 border border-slate-800 rounded-3xl space-y-3 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Extraction Visual Overlay</span>
                <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Avg Conf: {result.result.summary.average_confidence}%
                </span>
              </div>

              {/* Simulated Overlay Canvas */}
              <div className="relative w-full h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 opacity-90"></div>

                {/* Simulated Bounding Boxes Overlay */}
                <div className="relative z-10 w-full h-full border border-dashed border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="border-2 border-cyan-400 bg-cyan-500/10 p-2 rounded-lg text-[10px] font-mono text-cyan-300">
                      BLD-0001 (BHUMI Residency) <br/> 8 Floors | 96.4%
                    </div>
                    <div className="border-2 border-amber-400 bg-amber-500/10 p-2 rounded-lg text-[10px] font-mono text-amber-300">
                      PCL-0002 Boundary <br/> 97.1%
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="border-2 border-emerald-400 bg-emerald-500/10 p-2 rounded-lg text-[10px] font-mono text-emerald-300">
                      Road Reserve Buffer <br/> Verified
                    </div>
                    <div className="border-2 border-blue-400 bg-blue-500/10 p-2 rounded-lg text-[10px] font-mono text-blue-300">
                      Cauvery Heights <br/> 5 Floors | 94.8%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-center">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Buildings</span>
                <p className="font-bold text-white text-base mt-0.5">{result.result.summary.buildings_detected}</p>
              </div>
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-center">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Parcels</span>
                <p className="font-bold text-white text-base mt-0.5">{result.result.summary.parcels_detected}</p>
              </div>
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-center">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Floors Mapped</span>
                <p className="font-bold text-cyan-400 text-base mt-0.5">{result.result.summary.vertical_levels_identified}</p>
              </div>
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-center">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Built-Up Sq.Ft</span>
                <p className="font-bold text-emerald-400 text-base mt-0.5">{result.result.summary.estimated_built_up_area_sqft.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
