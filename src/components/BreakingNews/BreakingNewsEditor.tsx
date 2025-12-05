import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { breakingNewsApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface BreakingNewsItem {
  id?: string;
  title: string;
  url: string;
  priority: number;
  isActive: boolean;
  expiresAt?: string;
}

interface BreakingNewsEditorProps {
  item?: BreakingNewsItem;
  onClose: () => void;
}

export default function BreakingNewsEditor({ item, onClose }: BreakingNewsEditorProps) {
  const [formData, setFormData] = useState<BreakingNewsItem>({
    title: item?.title || '',
    url: item?.url || '',
    priority: item?.priority || 1,
    isActive: item?.isActive ?? true,
    expiresAt: item?.expiresAt || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: breakingNewsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breaking-news'] });
      toast.success('تم إنشاء الخبر العاجل بنجاح');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء إنشاء الخبر العاجل');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => breakingNewsApi.update(item!.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breaking-news'] });
      toast.success('تم تحديث الخبر العاجل بنجاح');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء تحديث الخبر العاجل');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item?.id) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          العنوان
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="أدخل عنوان الخبر العاجل"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          رابط الخبر
        </label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/article"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الأولوية (1-10)
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          تاريخ انتهاء الصلاحية (اختياري)
        </label>
        <input
          type="datetime-local"
          value={formData.expiresAt ? new Date(formData.expiresAt).toISOString().slice(0, 16) : ''}
          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="mr-2 text-sm font-medium text-gray-700">
          نشط
        </label>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {createMutation.isPending || updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
        </button>
      </div>
    </form>
  );
}
