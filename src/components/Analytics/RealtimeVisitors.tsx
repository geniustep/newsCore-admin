import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../lib/api';
import { UserGroupIcon } from '@heroicons/react/24/outline';

interface RealtimeData {
  count: number;
}

export default function RealtimeVisitors() {
  const { data: visitors } = useQuery<RealtimeData>({
    queryKey: ['analytics', 'realtime'],
    queryFn: async () => await analyticsApi.getRealtimeVisitors() as unknown as RealtimeData,
    refetchInterval: 5000, // تحديث كل 5 ثوان
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <UserGroupIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">الزوار المباشرون</h3>
      </div>
      <div className="text-3xl font-bold text-gray-900">
        {visitors?.count || 0}
      </div>
      <p className="text-sm text-gray-500 mt-2">زائر نشط الآن</p>
    </div>
  );
}
