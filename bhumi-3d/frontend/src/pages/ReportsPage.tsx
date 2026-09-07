import React from 'react';
import { downloadULPINPdf } from '../services/api';
import { FileText, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const reportsList = [
    { title: 'Official 3D ULPIN Spatial Rights Certificate', desc: 'Volumetric cadastral passport with QR code, coordinate elevation, and DoLR stamp.', type: 'PDF Certificate', action: () => downloadULPINPdf({ ulpin: 'IN-TN-CHN-ADY-00482-B03-F07-U21-X7' }) },
    { title: 'Multi-Storey Building Volumetric Audit Report', desc: 'Complete floor-by-floor breakdown of BHUMI Residency (8 stories, 32 units).', type: 'PDF Report', action: () => downloadULPINPdf({ ulpin: 'IN-TN-CHN-ADY-00482-BLD01-AUDIT' }) },
    { title: 'Subsurface Utility & Infrastructure Survey', desc: 'CMWSSB water pipelines, trunk sewage & TANGEDCO 33kV cable depth map.', type: 'GIS Summary', action: () => downloadULPINPdf({ ulpin: 'IN-TN-CHN-ADY-00482-UG-ASSETS' }) },
    { title: 'Topology Conflict & Validation Summary', desc: 'Audit report of 3D spatial overlaps, air-rights variances, and resolved conflicts.', type: 'Audit Log', action: () => downloadULPINPdf({ ulpin: 'IN-TN-CHN-ADY-00482-VALIDATION' }) }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <FileText className="text-blue-500" size={24} /> Cadastral Reports & ULPIN Certificates
        </h1>
        <p className="text-xs text-slate-400 mt-1">Export official 3D land governance reports, ULPIN property passports, and spatial survey certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportsList.map((r, idx) => (
          <div key={idx} className="p-6 bg-[#0f172a]/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  {r.type}
                </span>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <h3 className="font-bold text-white text-base leading-snug">{r.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
            </div>

            <button
              onClick={r.action}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <Download size={16} /> Export PDF Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
