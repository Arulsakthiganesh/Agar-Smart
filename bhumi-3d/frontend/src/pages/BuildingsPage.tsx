import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBuildings } from '../services/api';
import { Building } from '../types';
import { Building2, Box, Layers, ShieldCheck, CheckCircle2, Search } from 'lucide-react';

export const BuildingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBuildings().then((data) => {
      if (data.length > 0) setBuildings(data);
      else {
        setBuildings([
          { id: 1, building_id: 'BLD-0001', parcel_id: 1, name: 'BHUMI Residency', height: 26.5, floors_count: 8, built_up_area: 42000, ai_confidence: 98.4, status: 'Verified', floors: [] },
          { id: 2, building_id: 'BLD-0002', parcel_id: 2, name: 'Cauvery Heights', height: 16.8, floors_count: 5, built_up_area: 22000, ai_confidence: 95.2, status: 'Verified', floors: [] },
          { id: 3, building_id: 'BLD-0003', parcel_id: 3, name: 'Anna Nagar Commercial Complex', height: 18.0, floors_count: 6, built_up_area: 34000, ai_confidence: 94.1, status: 'Verified', floors: [] }
        ]);
      }
    });
  }, []);

  const filtered = buildings.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.building_id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Building2 className="text-blue-500" size={22} /> Multi-Storey Building Registry
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">3D Volumetric building footprints and vertical storey structures</p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search building name or ID..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map((bldg) => (
          <div key={bldg.id} className="p-5 bg-[#0f172a]/90 border border-slate-800 rounded-2xl space-y-4 hover:border-blue-500/40 transition-all shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">{bldg.name}</h3>
                <span className="text-[11px] font-mono text-cyan-400">ID: {bldg.building_id}</span>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} /> {bldg.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Total Height</span>
                <p className="font-bold text-slate-200 text-sm mt-0.5">{bldg.height} m</p>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Storeys / Floors</span>
                <p className="font-bold text-slate-200 text-sm mt-0.5">{bldg.floors_count} Floors</p>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Built-Up Area</span>
                <p className="font-bold text-slate-200 text-sm mt-0.5">{bldg.built_up_area.toLocaleString()} sq.ft</p>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">AI Confidence</span>
                <p className="font-bold text-cyan-400 text-sm mt-0.5">{bldg.ai_confidence}%</p>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => navigate('/map3d')}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow flex items-center justify-center gap-1.5"
              >
                <Box size={14} /> Open 3D Building
              </button>
              <button
                onClick={() => navigate('/floors-units')}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Layers size={14} /> View Floors
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
