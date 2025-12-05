import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../lib/api';

interface TrafficSource {
  name: string;
  visits: number;
}

export default function TrafficSources() {
  const { data: sources, isLoading } = useQuery<TrafficSource[]>({
    queryKey: ['analytics', 'traffic-sources'],
    queryFn: () => analyticsApi.getTrafficSources({ period: '30days' }),
  });

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">جاري التحميل...</div>;
  }

  if (!sources || sources.length === 0) {
    return <div className="text-center py-8 text-gray-500">لا توجد بيانات</div>;
  }

  const total = sources.reduce((sum, s) => sum + s.visits, 0);

  return (
    <div className="space-y-4">
      {sources.map((source) => {
        const percentage = (source.visits / total) * 100;
        return (
          <div key={source.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{source.name}</span>
              <span className="text-sm text-gray-600">
                {source.visits.toLocaleString()} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
