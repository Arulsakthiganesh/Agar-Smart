import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '' }) => {
  const getBadgeStyle = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'LOW':
        return 'badge-risk-low';
      case 'MODERATE':
        return 'badge-risk-moderate';
      case 'HIGH':
        return 'badge-risk-high';
      case 'SEVERE':
        return 'badge-risk-severe';
      case 'CRITICAL':
        return 'badge-risk-critical';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded text-xs font-semibold tracking-wider uppercase border inline-flex items-center gap-1.5 ${getBadgeStyle(level)} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
      {level}
    </span>
  );
};
