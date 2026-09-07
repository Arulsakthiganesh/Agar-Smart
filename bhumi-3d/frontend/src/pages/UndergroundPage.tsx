import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUndergroundAssets } from '../services/api';
import { UndergroundAsset } from '../types';
import { Pipette, Box, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const UndergroundPage: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<UndergroundAsset[]>([]);

  useEffect(() => {
    fetchUndergroundAssets().then((data) => {
      if (data.length > 0) setAssets(data);
      else {
        setAssets([
          { id: 1, asset_id: 'UG-WATER-00127', name: 'Adyar Main Water Pipeline Network', type: 'Water Pipeline', depth: 4.8, length: 1.8, owner_agency: 'CMWSSB', status: 'Operational', last_inspection: '2026-08-12' },
          { id: 2, asset_id: 'UG-SEWER-0084', name: 'Adyar Trunk Sewerage Line', type: 'Sewage Pipeline', depth: 6.2, length: 2.4, owner_agency: 'CMWSSB', status: 'Operational', last_inspection: '2026-07-28' },
          { id: 3, asset_id: 'UG-POWER-00312', name: 'TANGEDCO 33kV Power Conduit', type: 'Electrical Cable', depth: 2.2, length: 3.1, owner_agency: 'TANGEDCO', status: 'Operational', last_inspection: '2026-08-04' },
          { id: 4, asset_id: 'UG-METRO-LINE2', name: 'Chennai Metro Phase-2 Tunnel', type: 'Tunnel / Metro', depth: 18.5, length: 8.6, owner_agency: 'CMRL', status: 'Operational', last_inspection: '2026-08-18' }
        ]);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Pipette className="text-amber-400" size={22} /> Underground Subsurface Infrastructure
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">3D Volumetric cadastre for subterranean utilities, pipelines, cables, and transit tunnels</p>
        </div>

        <button
          onClick={() => navigate('/map3d')}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <Box size={16} /> Open 3D Subsurface View
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assets.map((asset) => (
          <div key={asset.id} className="p-5 bg-[#0f172a]/90 border border-slate-800 rounded-2xl space-y-3 shadow-xl hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="font-bold text-white text-base">{asset.name}</h3>
                <span className="text-[11px] font-mono text-amber-400">ID: {asset.asset_id}</span>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} /> {asset.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Depth Below Ground</span>
                <p className="font-bold text-amber-400 text-sm mt-0.5">-{asset.depth} m</p>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Network Length</span>
                <p className="font-bold text-slate-200 text-sm mt-0.5">{asset.length} km</p>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 col-span-2">
                <span className="text-slate-400">Managing Agency</span>
                <p className="font-bold text-slate-200 text-xs mt-0.5">{asset.owner_agency}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
