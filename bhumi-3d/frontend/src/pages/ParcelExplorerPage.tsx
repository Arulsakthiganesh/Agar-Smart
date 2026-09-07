import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapView } from '../components/MapView';
import { fetchParcels } from '../services/api';
import { Parcel } from '../types';
import { Map, Search, Filter, Box, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ParcelExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [search, setSearch] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  useEffect(() => {
    fetchParcels().then(setParcels);
  }, []);

  const filteredParcels = parcels.filter((p) => {
    const matchesSearch =
      !search ||
      p.parcel_id.toLowerCase().includes(search.toLowerCase()) ||
      p.survey_number.toLowerCase().includes(search.toLowerCase()) ||
      p.owner_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.ulpin && p.ulpin.toLowerCase().includes(search.toLowerCase()));

    const matchesVillage = selectedVillage === 'All' || p.village === selectedVillage;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

    return matchesSearch && matchesVillage && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Map className="text-blue-500" size={22} /> Cadastral Parcel Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Filter, search, and inspect 2D surface parcels and 3D land ownership records</p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search survey no, ULPIN, owner..."
              className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 cursor-pointer"
          >
            <option value="All">All Villages / Wards</option>
            <option value="Adyar">Adyar</option>
            <option value="Anna Nagar">Anna Nagar</option>
            <option value="Velachery">Velachery</option>
          </select>
        </div>
      </div>

      {/* Split Pane: Map Left (50%), Cards Right (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-12rem)]">
        {/* Leaflet GIS Map */}
        <MapView
          parcels={filteredParcels}
          center={selectedParcel ? [selectedParcel.latitude, selectedParcel.longitude] : [13.0067, 80.2206]}
          onParcelSelect={setSelectedParcel}
        />

        {/* Right Scrollable Cards Grid */}
        <div className="space-y-3 overflow-y-auto pr-1">
          {filteredParcels.map((parcel) => (
            <div
              key={parcel.id}
              onClick={() => setSelectedParcel(parcel)}
              className={`p-4 bg-[#0f172a]/90 border rounded-2xl cursor-pointer transition-all duration-200 hover:border-blue-500/50 ${
                selectedParcel?.id === parcel.id
                  ? 'border-blue-500 bg-blue-950/20 shadow-xl shadow-blue-500/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-blue-400 text-sm">{parcel.parcel_id}</span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                    {parcel.survey_number}
                  </span>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} /> {parcel.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Owner / Agency</span>
                  <strong className="text-slate-200 truncate block">{parcel.owner_name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Locality / Village</span>
                  <strong className="text-slate-200">{parcel.village}, {parcel.district}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Parcel Area</span>
                  <strong className="text-slate-200">{parcel.area.toLocaleString()} sq.ft</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Property Type</span>
                  <strong className="text-cyan-400">{parcel.property_type}</strong>
                </div>
              </div>

              <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                <span className="truncate">ULPIN: {parcel.ulpin}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/map3d');
                  }}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-sans font-semibold text-[11px] flex items-center gap-1 shrink-0 ml-2 shadow"
                >
                  <Box size={12} /> 3D View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
