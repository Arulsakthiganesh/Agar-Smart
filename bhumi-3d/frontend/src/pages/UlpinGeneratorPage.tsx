import React, { useState } from 'react';
import { generateULPIN, downloadULPINPdf } from '../services/api';
import { ULPINRecord } from '../types';
import { Hash, Sparkles, QrCode, FileText, Copy, Check, Box, ArrowRight } from 'lucide-react';

export const UlpinGeneratorPage: React.FC = () => {
  const [formData, setFormData] = useState({
    state: 'Tamil Nadu',
    district: 'Chennai',
    taluk: 'Mylapore-Triplicane',
    village: 'Adyar',
    survey_number: 'SY-104/2A',
    parcel_number: 'PCL-0001',
    property_type: 'Vertical Apartment',
    building_id: 'BLD-0001',
    floor_number: 7,
    unit_number: 'A-703',
    latitude: 13.0067,
    longitude: 80.2206,
    elevation: 33.5,
  });

  const [generatedResult, setGeneratedResult] = useState<ULPINRecord | null>({
    id: 1,
    ulpin: 'IN-TN-CHN-ADY-00482-B03-F07-U21-X7',
    spatial_level: 'Vertical Unit (Apartment)',
    state: 'Tamil Nadu',
    district: 'Chennai',
    locality: 'Adyar',
    parcel_id: 'PCL-0001',
    building_id: 'BLD-0001',
    floor_id: '7',
    unit_id: 'A-703',
    latitude: 13.0067,
    longitude: 80.2206,
    elevation: 33.5,
    qr_code_path: '',
    created_at: new Date().toISOString(),
  });

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await generateULPIN(formData);
      setGeneratedResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedResult) {
      navigator.clipboard.writeText(generatedResult.ulpin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPdf = () => {
    if (generatedResult) {
      downloadULPINPdf({
        ulpin: generatedResult.ulpin,
        spatial_level: generatedResult.spatial_level,
        state: generatedResult.state,
        district: generatedResult.district,
        locality: generatedResult.locality,
        parcel_id: generatedResult.parcel_id,
        building_name: 'BHUMI Residency',
        floor_number: Number(generatedResult.floor_id) || 7,
        unit_number: generatedResult.unit_id || 'A-703',
        latitude: generatedResult.latitude,
        longitude: generatedResult.longitude,
        elevation: generatedResult.elevation,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Hash className="text-cyan-400" size={24} /> 3D ULPIN Spatial Identifier Generator
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate standardized 14+ digit 3D Unique Land Parcel Identification Numbers incorporating spatial coordinate elevation & vertical air-rights bounds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Input Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 bg-[#0f172a]/90 border border-slate-800 rounded-3xl space-y-4 shadow-2xl">
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider text-[11px] mb-2">Cadastral & Spatial Parameters</h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500"
              >
                <option value="Tamil Nadu">Tamil Nadu (TN)</option>
                <option value="Karnataka">Karnataka (KA)</option>
                <option value="Maharashtra">Maharashtra (MH)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500"
              >
                <option value="Chennai">Chennai (CHN)</option>
                <option value="Coimbatore">Coimbatore (CBE)</option>
                <option value="Madurai">Madurai (MDU)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Locality / Ward</label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Survey Number</label>
              <input
                type="text"
                value={formData.survey_number}
                onChange={(e) => setFormData({ ...formData, survey_number: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Building ID</label>
              <input
                type="text"
                value={formData.building_id}
                onChange={(e) => setFormData({ ...formData, building_id: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Floor Number</label>
              <input
                type="number"
                value={formData.floor_number}
                onChange={(e) => setFormData({ ...formData, floor_number: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Unit Number</label>
              <input
                type="text"
                value={formData.unit_number}
                onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs pt-1">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Latitude (°N)</label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Longitude (°E)</label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Elevation (MSL m)</label>
              <input
                type="number"
                step="0.1"
                value={formData.elevation}
                onChange={(e) => setFormData({ ...formData, elevation: parseFloat(e.target.value) })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-4"
          >
            <Sparkles size={18} /> {loading ? 'Computing 3D ULPIN...' : 'Generate 3D Spatial ULPIN'}
          </button>
        </form>

        {/* Output ULPIN Card Preview */}
        {generatedResult && (
          <div className="lg:col-span-5 p-6 bg-[#0f172a]/90 border border-cyan-500/40 rounded-3xl space-y-5 shadow-2xl relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Check size={16} /> Official 3D ULPIN Issued
                </span>
                <span className="text-[10px] font-mono bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
                  {generatedResult.spatial_level}
                </span>
              </div>

              {/* Big ULPIN Display Box */}
              <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-center space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">3D Unique Spatial Identifier</span>
                <p className="font-mono font-extrabold text-cyan-400 text-lg break-all tracking-wider glow-text-cyan">
                  {generatedResult.ulpin}
                </p>

                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-medium transition-colors border border-slate-700 mt-1"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy ULPIN'}</span>
                </button>
              </div>

              {/* Coordinates breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Lat / Lon</span>
                  <p className="font-mono text-slate-200 font-semibold">{generatedResult.latitude.toFixed(4)}°, {generatedResult.longitude.toFixed(4)}°</p>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Elevation MSL</span>
                  <p className="font-mono text-cyan-400 font-semibold">{generatedResult.elevation} meters</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button
                onClick={handleDownloadPdf}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <FileText size={16} /> Download 3D ULPIN PDF Certificate
              </button>

              <button
                onClick={() => window.open('/map3d', '_self')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <Box size={16} /> View Unit Spatial Geometry in 3D
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
