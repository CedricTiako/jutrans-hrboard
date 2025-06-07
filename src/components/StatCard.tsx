import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  className = '',
}) => {
  const renderTrendIcon = () => {
    if (trend === undefined) return null;
    
    if (trend > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (trend < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className={`bg-white rounded-lg shadow p-5 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-900">{value}</h3>
        </div>
        {icon && (
          <div className="p-2 bg-blue-50 rounded-full">
            {icon}
          </div>
        )}
      </div>
      
      {(trend !== undefined || trendLabel) && (
        <div className="mt-4 flex items-center text-sm">
          {renderTrendIcon()}
          <span className={`ml-1 ${
            trend === undefined ? 'text-gray-500' :
            trend > 0 ? 'text-green-600' :
            trend < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {trend !== undefined && `${Math.abs(trend)}%`}{' '}
            {trendLabel && <span className="text-gray-500">{trendLabel}</span>}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;