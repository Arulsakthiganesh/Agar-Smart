import React, { useState } from 'react';
import { Layers, CheckCircle2, AlertTriangle, Box, FileText } from 'lucide-react';
import { downloadULPINPdf } from '../services/api';

export const FloorsUnitsPage: React.FC = () => {
  const [selectedFloor, setSelectedFloor] = useState<number>(7);

  const unitsData = [
    { unit: 'A-701', area: 1250, type: '3 BHK Apartment', ulpin: 'IN-TN-CHN-ADY-00482-B03-F07-U01-A1', owner: 'Anand Chandrasekar', status: 'Verified' },
    { unit: 'A-702', area: 980, type: '2 BHK Apartment', ulpin: 'IN-TN-CHN-ADY-00482-B03-F07-U02-B2', owner: 'Priya Sundaram', status: 'Verified' },
    { unit: 'A-703', area: 1100, type: '2.5 BHK Apartment', ulpin: 'IN-TN-CHN-ADY-00482-B03-F07-U03-C3', owner: 'Sanjay Raghavan', status: 'Boundary Mismatch' },
    { unit: 'A-704', area: 890, type: '2 BHK Apartment', ulpin: 'IN-TN-CHN-ADY-00482-B03-F07-U04-D4', owner: 'Deepa Venkatesh', status: 'Verified' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Layers className="text-cyan-400" size={22} /> Floor & Vertical Unit Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">BHUMI Residency • Building ID: BLD-0001 (8 Floors Mapped)</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {[8, 7, 6, 5, 4, 3, 2, 1].map((flr) => (
            <button
              key={flr}
              onClick={() => setSelectedFloor(flr)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedFloor === flr ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              F{flr}
            </button>
          ))}
        </div>
      </div>

      {/* Units Table */}
      <div className="p-5 bg-[#0f172a]/90 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-sm">
            Units Registered on Floor {selectedFloor}
          </h3>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
            4 Units Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-2.5 px-3">Unit ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Carpet Area</th>
                <th className="py-2.5 px-3">Owner</th>
                <th className="py-2.5 px-3">3D ULPIN</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {unitsData.map((u) => (
                <tr key={u.unit} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-100">{u.unit}</td>
                  <td className="py-3 px-3 text-slate-300">{u.type}</td>
                  <td className="py-3 px-3 text-slate-300 font-mono">{u.area} sq.ft</td>
                  <td className="py-3 px-3 text-slate-200 font-medium">{u.owner}</td>
                  <td className="py-3 px-3 font-mono text-cyan-400">{u.ulpin}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit ${
                      u.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {u.status === 'Verified' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => downloadULPINPdf({ ulpin: u.ulpin, floor_number: selectedFloor, unit_number: u.unit })}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-[11px] inline-flex items-center gap-1"
                    >
                      <FileText size={12} /> Cert PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
