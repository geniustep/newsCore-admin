import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../lib/api';
import { EyeIcon } from '@heroicons/react/24/outline';

interface TopArticle {
  id: string;
  title: string;
  category: string;
  views: number;
}

export default function TopArticles() {
  const { data: topArticles, isLoading } = useQuery<TopArticle[]>({
    queryKey: ['analytics', 'top-articles'],
    queryFn: () => analyticsApi.getTopArticles({ limit: 10 }),
  });

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">جاري التحميل...</div>;
  }

  if (!topArticles || topArticles.length === 0) {
    return <div className="text-center py-8 text-gray-500">لا توجد بيانات</div>;
  }

  return (
    <div className="space-y-3">
      {topArticles.map((article, index) => (
        <div
          key={article.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          <div className="flex items-center gap-3 flex-1">
            <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{article.title}</h4>
              <p className="text-sm text-gray-500">{article.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <EyeIcon className="w-5 h-5" />
            <span className="font-medium">{article.views?.toLocaleString() || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
