import React from 'react';
import { Alert } from '../types';
import { RiskBadge } from './RiskBadge';
import { X, Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, alerts }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0D111D] border-l border-[#1F2937] h-full p-4 flex flex-col justify-between shadow-2xl">
        <div className="space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
            <div className="flex items-center gap-2 font-mono font-bold text-white text-sm">
              <Bell size={18} className="text-red-400" /> OPERATIONAL ALERT DRAWER
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#111827]"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-500">No active warning notifications.</div>
            ) : (
              alerts.map((a) => (
                <div key={a.id} className="p-3 bg-[#111827] border border-[#1F2937] rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-red-400">{a.alert_code}</span>
                    <RiskBadge level={a.severity} />
                  </div>
                  <div className="font-bold text-gray-200">{a.location_name}</div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">{a.message}</p>
                  <div className="text-[10px] text-gray-500 font-mono pt-1 border-t border-[#1F2937] flex justify-between">
                    <span>Issued: {new Date(a.created_at).toLocaleTimeString()}</span>
                    <span className="text-emerald-400 font-bold">ACTIVE</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-[#1F2937] pt-3">
          <button
            onClick={onClose}
            className="w-full py-2 bg-[#111827] hover:bg-[#1F2937] text-gray-300 rounded-lg text-xs font-mono font-bold"
          >
            CLOSE DRAWER
          </button>
        </div>
      </div>
    </div>
  );
};
