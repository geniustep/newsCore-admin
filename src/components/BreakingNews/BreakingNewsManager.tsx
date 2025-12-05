import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { breakingNewsApi } from '../../lib/api';
import { useState } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import BreakingNewsEditor from './BreakingNewsEditor';

interface BreakingNewsItem {
  id: string;
  title: string;
  url: string;
  priority: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BreakingNewsManager() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BreakingNewsItem | undefined>();

  const { data: news, isLoading } = useQuery<BreakingNewsItem[]>({
    queryKey: ['breaking-news', 'all'],
    queryFn: () => breakingNewsApi.getAll(),
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: breakingNewsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breaking-news'] });
      toast.success('تم حذف الخبر العاجل بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء حذف الخبر العاجل');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: breakingNewsApi.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breaking-news'] });
      toast.success('تم تحديث حالة الخبر العاجل');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء تحديث الحالة');
    },
  });

  const handleEdit = (item: BreakingNewsItem) => {
    setSelectedItem(item);
    setIsEditorOpen(true);
  };

  const handleNew = () => {
    setSelectedItem(undefined);
    setIsEditorOpen(true);
  };

  const handleClose = () => {
    setIsEditorOpen(false);
    setSelectedItem(undefined);
  };

  if (isEditorOpen) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">
          {selectedItem ? 'تعديل خبر عاجل' : 'إضافة خبر عاجل جديد'}
        </h2>
        <BreakingNewsEditor item={selectedItem} onClose={handleClose} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الأخبار العاجلة</h1>
          <p className="text-gray-600 mt-1">إدارة الأخبار العاجلة المعروضة في الموقع</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5" />
          إضافة خبر عاجل
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">جاري التحميل...</div>
      ) : !news || news.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">لا توجد أخبار عاجلة</p>
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إضافة أول خبر عاجل
          </button>
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
                  الرابط
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الأولوية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الانتهاء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {item.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.expiresAt
                      ? format(new Date(item.expiresAt), 'PPp', { locale: ar })
                      : 'لا يوجد'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleMutation.mutate(item.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title={item.isActive ? 'إخفاء' : 'إظهار'}
                      >
                        {item.isActive ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="تعديل"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا الخبر العاجل؟')) {
                            deleteMutation.mutate(item.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="حذف"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
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
