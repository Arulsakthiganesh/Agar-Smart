import React, { useState } from 'react';
import { uploadFileApi } from '../services/api';
import { UploadCloud, FileCheck, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export const DataUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadFileApi(formData);
      setUploadMessage(res.message);
    } catch (e: any) {
      setUploadMessage(e.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <UploadCloud className="text-cyan-400" size={24} /> Geospatial & Cadastral Data Upload
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ingest GIS datasets, drone imagery rasters, point clouds, floor plan PDFs, and cadastral survey CSVs.
        </p>
      </div>

      <form onSubmit={handleUploadSubmit} className="p-8 bg-[#0f172a]/90 border border-slate-800 rounded-3xl space-y-5 shadow-2xl text-center">
        <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-8 transition-colors bg-slate-900/50 cursor-pointer">
          <UploadCloud size={36} className="text-cyan-400 mx-auto mb-3" />
          <h3 className="font-bold text-white text-base">Drag & Drop files here or click to select</h3>
          <p className="text-xs text-slate-400 mt-1">Accepted formats: .GeoJSON, .KML, .CSV, .LAS/.LAZ, .PNG, .JPG, .PDF</p>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="inline-block mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 cursor-pointer transition-colors"
          >
            Select File from Device
          </label>
        </div>

        {file && (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-left">
            <div>
              <span className="font-bold text-slate-100">{file.name}</span>
              <p className="text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow"
            >
              {uploading ? 'Ingesting File...' : 'Upload File'}
            </button>
          </div>
        )}

        {uploadMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 size={16} /> {uploadMessage}
          </div>
        )}
      </form>
    </div>
  );
};
