import React, { useState } from 'react';
import { Alert } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { AlertTriangle, ShieldCheck, CheckCircle2, MapPin, Clock, FileText, BellRing } from 'lucide-react';
import { fetchApi } from '../api/apiClient';

interface AlertCenterPageProps {
  alerts: Alert[];
  onRefresh: () => void;
}

export const AlertCenterPage: React.FC<AlertCenterPageProps> = ({ alerts, onRefresh }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === 'ALL' || a.severity === filterSeverity
  );

  const handleAcknowledge = async (alertId: string) => {
    try {
      await fetchApi(`/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        body: JSON.stringify({ acknowledged_by: 'Dr. A. K. Sharma (Duty Meteorologist)' }),
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} /> NATIONAL EMERGENCY WEATHER ALERT CENTER
          </h2>
          <p className="text-xs text-gray-400">Rule-engine generated severe thunderstorm & lightning warnings</p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">Filter Severity:</span>
          {['ALL', 'CRITICAL', 'SEVERE', 'HIGH', 'MODERATE'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded text-xs font-bold tracking-wider transition-all ${
                filterSeverity === sev
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-[#111827] text-gray-400 border border-[#1F2937] hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* ALERT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="col-span-2 bg-[#111827] border border-[#1F2937] rounded-xl p-8 text-center text-gray-400 space-y-2">
            <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
            <div className="text-sm font-bold text-white">No Active Alerts matching selected severity</div>
            <p className="text-xs text-gray-500">All meteorological sectors report normal baseline operational risk.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-[#111827] border rounded-xl p-5 space-y-4 shadow-xl transition-all ${
                alert.severity === 'CRITICAL'
                  ? 'border-red-600/60 shadow-red-950/20'
                  : alert.severity === 'SEVERE'
                  ? 'border-orange-500/50'
                  : 'border-[#1F2937]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
                <div className="flex items-center gap-2">
                  <BellRing size={18} className="text-red-400 animate-pulse" />
                  <div>
                    <span className="font-mono font-bold text-sm text-white">{alert.alert_code}</span>
                    <span className="text-[10px] text-gray-400 block uppercase font-mono">{alert.category}</span>
                  </div>
                </div>
                <RiskBadge level={alert.severity} />
              </div>

              {/* Location & Message */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
                  <MapPin size={14} className="text-blue-400" />
                  <span>{alert.location_name}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed bg-[#0D111D] p-3 rounded-lg border border-[#1F2937]">
                  {alert.message}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="bg-red-950/30 border border-red-800/40 p-3 rounded-lg text-xs space-y-1">
                <span className="font-bold text-red-400 text-[10px] uppercase block">RECOMMENDED DISASTER MANAGEMENT ACTION</span>
                <p className="text-red-200 font-medium leading-normal">{alert.recommended_action}</p>
              </div>

              {/* Metrics Summary */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-[#0D111D] p-2 rounded border border-[#1F2937]">
                  <span className="text-gray-500 text-[10px] uppercase block">Thunderstorm</span>
                  <span className="font-bold text-blue-400">{Math.round(alert.thunderstorm_prob * 100)}%</span>
                </div>
                <div className="bg-[#0D111D] p-2 rounded border border-[#1F2937]">
                  <span className="text-gray-500 text-[10px] uppercase block">Lightning</span>
                  <span className="font-bold text-amber-400">{Math.round(alert.lightning_prob * 100)}%</span>
                </div>
                <div className="bg-[#0D111D] p-2 rounded border border-[#1F2937]">
                  <span className="text-gray-500 text-[10px] uppercase block">Confidence</span>
                  <span className="font-bold text-emerald-400">{Math.round(alert.confidence * 100)}%</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1F2937]">
                <span className="text-[10px] text-gray-500 font-mono">
                  Issued: {new Date(alert.created_at).toLocaleTimeString()}
                </span>
                <div className="flex items-center gap-2">
                  {alert.status === 'ACTIVE' ? (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 size={14} />
                      Acknowledge Warning
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 size={14} /> ACKNOWLEDGED BY {alert.acknowledged_by || 'DUTY MET'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
