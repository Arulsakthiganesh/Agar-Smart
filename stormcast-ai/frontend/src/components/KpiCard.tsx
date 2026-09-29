import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  colorClass?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  colorClass = 'text-blue-400'
}) => {
  return (
    <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 flex flex-col justify-between hover:border-gray-700 transition-all shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</span>
        <div className={`p-2 rounded-md bg-[#1F2937]/50 ${colorClass}`}>
          <Icon size={18} />
        </div>
      </div>

      <div className="my-3">
        <div className="text-2xl font-bold text-gray-100 tracking-tight">{value}</div>
        {trend && (
          <div className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1">
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 border-t border-[#1F2937] pt-2 mt-1">
        {subtext}
      </div>
    </div>
  );
};
