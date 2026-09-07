import React from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadULPINPdf } from '../services/api';
import { Box, FileText, CheckCircle2, ShieldCheck, MapPin, Building2, Layers } from 'lucide-react';

export const PropertyDetailsPage: React.FC = () => {
  const navigate = useNavigate();

  const propertyData = {
    ulpin: 'IN-TN-CHN-ADY-00482-B03-F07-U21-X7',
    survey_number: 'SY-104/2A',
    parcel_id: 'PCL-0001',
    building_name: 'BHUMI Residency',
    floor: 7,
    unit: 'A-703',
    owner: 'Sanjay Raghavan',
    area: 1100,
    elevation: 33.5,
    location: 'Adyar, Chennai, Tamil Nadu (Ward 174)',
    latitude: 13.0067,
    longitude: 80.2206,
    status: 'Verified Cadastral Record'
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">3D Cadastral Property Passport</h1>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} /> {propertyData.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">{propertyData.ulpin}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadULPINPdf(propertyData)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
          >
            <FileText size={16} /> Download Certificate PDF
          </button>
          <button
            onClick={() => navigate('/map3d')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2"
          >
            <Box size={16} /> View 3D Spatial Model
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#0f172a]/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Property Identity</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">3D ULPIN:</span>
              <strong className="font-mono text-cyan-400">{propertyData.ulpin}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Survey Number:</span>
              <strong className="text-slate-200">{propertyData.survey_number}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Parcel ID:</span>
              <strong className="text-slate-200">{propertyData.parcel_id}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Building Structure:</span>
              <strong className="text-slate-200">{propertyData.building_name}</strong>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#0f172a]/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Volumetric & Ownership</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Registered Owner:</span>
              <strong className="text-slate-200">{propertyData.owner}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Floor Level & Unit:</span>
              <strong className="text-slate-200">Floor {propertyData.floor} | Unit {propertyData.unit}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Carpet Area:</span>
              <strong className="text-slate-200">{propertyData.area} sq.ft</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Elevation Above MSL:</span>
              <strong className="text-cyan-400">{propertyData.elevation} meters</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
