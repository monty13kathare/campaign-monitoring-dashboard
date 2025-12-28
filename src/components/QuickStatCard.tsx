// components/StatCard.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  accentColor?: string;
  compact?: boolean;
}

export  const QuickStatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  accentColor = 'text-gray-900',
  compact = false
}) => {
  return (
    <div className={`text-center ${compact ? 'p-3' : 'p-4'} bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200`}>
      <div className={`${compact ? 'text-lg' : 'text-xl'} font-bold ${accentColor}`}>
        {value}
      </div>
      <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600 mt-1`}>
        {title}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-400 mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );
};

