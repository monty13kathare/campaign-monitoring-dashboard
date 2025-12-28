// components/MetricCard.tsx
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  borderColor: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  showLive?: boolean;
  liveText?: string;
  isLoading?: boolean;
  format?: 'number' | 'currency' | 'percentage' | 'default';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  borderColor,
  icon: Icon,
  iconColor = 'text-gray-600',
  iconBgColor = 'bg-gray-100',
  showLive = false,
  liveText = 'LIVE',
  isLoading = false,
  format = 'default'
}) => {
  const formatValue = (val: string | number) => {
    if (isLoading) return 'Loading...';
    
    if (typeof val === 'number') {
      switch (format) {
        case 'currency':
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(val);
        case 'percentage':
          return `${val.toFixed(2)}%`;
        case 'number':
          return new Intl.NumberFormat('en-US').format(val);
        default:
          return val;
      }
    }
    return val;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 border-l-4 ${borderColor}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-2 rounded-lg ${iconBgColor}`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              {title}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </div>
          </div>
        </div>
        {showLive && (
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {liveText}
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        {description}
      </div>
    </div>
  );
};