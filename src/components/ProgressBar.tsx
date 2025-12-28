// components/ProgressBar.tsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ProgressBarProps {
  label: string;
  value: number;
  valueDisplay: string;
  maxValue?: number;
  showTrend?: boolean;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'red';
  showValueBar?: boolean;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  valueDisplay,
  maxValue = 100,
  showTrend = false,
  showPercentage = false,
  color = 'blue',
  showValueBar = true,
  trendDirection = 'neutral'
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600'
  };

  const trendIcons = {
    up: <TrendingUp className="w-4 h-4 text-green-500" />,
    down: <TrendingDown className="w-4 h-4 text-red-500" />,
    neutral: null
  };

  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {valueDisplay}
            {showPercentage && '%'}
          </span>
          {showTrend && trendIcons[trendDirection]}
        </div>
      </div>
      {showValueBar && (
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full bg-linear-to-r ${colorClasses[color]} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};