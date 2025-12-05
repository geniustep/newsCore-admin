import { useQuery } from '@tanstack/react-query';
import { articlesApi } from '../lib/api';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function ScheduledPosts() {
  const { data: scheduledPosts, isLoading } = useQuery({
    queryKey: ['articles', 'scheduled'],
    queryFn: () => articlesApi.getAll({ scheduled: true }),
  });

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">المقالات المجدولة</h1>
        <p className="text-gray-600 mt-1">عرض وإدارة المقالات المجدولة للنشر</p>
      </div>

      {!scheduledPosts || scheduledPosts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <ClockIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">لا توجد مقالات مجدولة</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العنوان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ النشر المجدول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scheduledPosts.map((post: any) => (
                <tr key={post.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.publishedAt
                      ? format(new Date(post.publishedAt), 'PPp', { locale: ar })
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      مجدول
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
