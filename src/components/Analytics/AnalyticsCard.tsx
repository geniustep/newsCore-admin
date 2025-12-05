import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down';
}

export default function AnalyticsCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: AnalyticsCardProps) {
  const isPositive = trend === 'up' ? (change && change > 0) : (change && change < 0);
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
            {trend === 'up' ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
