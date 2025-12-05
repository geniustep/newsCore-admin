import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../lib/api';
import AnalyticsCard from '../components/Analytics/AnalyticsCard';
import ChartLine from '../components/Analytics/ChartLine';
import TopArticles from '../components/Analytics/TopArticles';
import TrafficSources from '../components/Analytics/TrafficSources';
import RealtimeVisitors from '../components/Analytics/RealtimeVisitors';
import {
  EyeIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface OverviewData {
  pageViews?: number;
  pageViewsChange?: number;
  visitors?: number;
  visitorsChange?: number;
  avgTimeOnSite?: number;
  avgTimeChange?: number;
  bounceRate?: number;
  bounceRateChange?: number;
}

interface PageviewData {
  date: string;
  value: number;
}

export default function Analytics() {
  const { data: overview } = useQuery<OverviewData>({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => await analyticsApi.getOverview({ period: '7days' }) as unknown as OverviewData,
  });

  const { data: pageviews } = useQuery<PageviewData[]>({
    queryKey: ['analytics', 'pageviews'],
    queryFn: async () => await analyticsApi.getPageviews({ period: '30days' }) as unknown as PageviewData[],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">التحليلات</h1>
        <p className="text-gray-600 mt-1">
          تتبع أداء موقعك وتحليل سلوك الزوار
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="مشاهدات الصفحة"
          value={overview?.pageViews?.toLocaleString() || 0}
          change={overview?.pageViewsChange || 0}
          icon={EyeIcon}
          trend="up"
        />
        <AnalyticsCard
          title="الزوار"
          value={overview?.visitors?.toLocaleString() || 0}
          change={overview?.visitorsChange || 0}
          icon={UserGroupIcon}
          trend="up"
        />
        <AnalyticsCard
          title="متوسط وقت القراءة"
          value={`${overview?.avgTimeOnSite || 0} د`}
          change={overview?.avgTimeChange || 0}
          icon={ClockIcon}
        />
        <AnalyticsCard
          title="معدل الارتداد"
          value={`${overview?.bounceRate || 0}%`}
          change={overview?.bounceRateChange || 0}
          icon={ArrowTrendingUpIcon}
          trend="down" // Lower is better
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">
            مشاهدات الصفحة - آخر 30 يوم
          </h3>
          <ChartLine data={pageviews || []} />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">مصادر الزيارات</h3>
          <TrafficSources />
        </div>
      </div>

      {/* Top Articles and Realtime */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">المقالات الأكثر مشاهدة</h3>
          <TopArticles />
        </div>

        <RealtimeVisitors />
      </div>
    </div>
  );
}
