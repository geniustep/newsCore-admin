import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  HomeIcon,
  GlobeAltIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';
import { pagesApi } from '../lib/api';

const statusLabels: Record<string, { label: string; class: string }> = {
  DRAFT: { label: 'مسودة', class: 'badge-gray' },
  PUBLISHED: { label: 'منشور', class: 'badge-success' },
  ARCHIVED: { label: 'مؤرشف', class: 'badge-warning' },
};

const templateLabels: Record<string, string> = {
  default: 'افتراضي',
  'full-width': 'عرض كامل',
  sidebar: 'مع شريط جانبي',
  contact: 'تواصل',
  about: 'من نحن',
  landing: 'صفحة هبوط',
};

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function Pages() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [language, setLanguage] = useState('');
  const [page, setPage] = useState(1);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['pages', { search, status, language, page }],
    queryFn: () =>
      pagesApi.getAll({
        search: search || undefined,
        status: status || undefined,
        language: language || undefined,
        page,
        limit: 15,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pagesApi.delete(id),
    onSuccess: () => {
      toast.success('تم حذف الصفحة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => pagesApi.publish(id),
    onSuccess: () => {
      toast.success('تم نشر الصفحة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const setHomepageMutation = useMutation({
    mutationFn: (id: string) => pagesApi.setAsHomepage(id),
    onSuccess: () => {
      toast.success('تم تعيين الصفحة الرئيسية بنجاح');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string, title: string, isSystem: boolean) => {
    if (isSystem) {
      toast.error('لا يمكن حذف صفحة نظام');
      return;
    }
    if (confirm(`هل أنت متأكد من حذف "${title}"؟`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSetHomepage = (id: string, title: string) => {
    if (confirm(`هل تريد تعيين "${title}" كصفحة رئيسية؟`)) {
      setHomepageMutation.mutate(id);
    }
  };

  // Backend returns { data: [...], meta: {...} }
  const pages = (data as any)?.data || [];
  const meta = (data as any)?.meta || { total: 0, totalPages: 1 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الصفحات</h1>
          <p className="text-gray-500 mt-1">إدارة الصفحات الثابتة مثل من نحن، التواصل، وغيرها</p>
        </div>
        <Link
          to="/pages/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          صفحة جديدة
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الصفحات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">جميع الحالات</option>
              <option value="DRAFT">مسودة</option>
              <option value="PUBLISHED">منشور</option>
              <option value="ARCHIVED">مؤرشف</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <GlobeAltIcon className="w-5 h-5 text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">جميع اللغات</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 spinner mx-auto" />
            <p className="mt-2 text-gray-500">جاري التحميل...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد صفحات</h3>
            <p className="text-gray-500 mb-4">ابدأ بإنشاء صفحتك الأولى</p>
            <Link
              to="/pages/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              إنشاء صفحة
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الصفحة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      القالب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الترجمات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pages.map((pageItem: any) => (
                    <tr key={pageItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {pageItem.featuredImageUrl ? (
                            <img
                              src={pageItem.featuredImageUrl}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                              <DocumentTextIcon className="w-6 h-6 text-primary-600" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 truncate max-w-xs">
                                {pageItem.title}
                              </p>
                              {pageItem.isHomepage && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                  <HomeIcon className="w-3 h-3" />
                                  الرئيسية
                                </span>
                              )}
                              {pageItem.isSystem && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  نظام
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="truncate max-w-xs">/{pageItem.slug}</span>
                              {pageItem.parent && (
                                <span className="flex items-center gap-1 text-gray-400">
                                  <ChevronRightIcon className="w-3 h-3" />
                                  {pageItem.parent.title}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {templateLabels[pageItem.template] || pageItem.template}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge ${
                            statusLabels[pageItem.status]?.class || 'badge-gray'
                          }`}
                        >
                          {statusLabels[pageItem.status]?.label || pageItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {languages.map((lang) => {
                            const hasTranslation =
                              pageItem.language === lang.code ||
                              pageItem.translations?.some(
                                (t: any) => t.language === lang.code
                              );
                            return (
                              <span
                                key={lang.code}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                  hasTranslation
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                                title={
                                  hasTranslation
                                    ? `${lang.name} متوفر`
                                    : `${lang.name} غير متوفر`
                                }
                              >
                                {lang.flag}
                              </span>
                            );
                          })}
                          <button
                            onClick={() => {
                              setSelectedPage(pageItem);
                              setShowTranslationModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                            title="إدارة الترجمات"
                          >
                            <LanguageIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(pageItem.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {pageItem.status === 'DRAFT' && (
                            <button
                              onClick={() => publishMutation.mutate(pageItem.id)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="نشر"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                          )}
                          {!pageItem.isHomepage && pageItem.status === 'PUBLISHED' && (
                            <button
                              onClick={() => handleSetHomepage(pageItem.id, pageItem.title)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="تعيين كصفحة رئيسية"
                            >
                              <HomeIcon className="w-5 h-5" />
                            </button>
                          )}
                          <Link
                            to={`/pages/${pageItem.id}/edit`}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(pageItem.id, pageItem.title, pageItem.isSystem)
                            }
                            disabled={pageItem.isSystem}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={pageItem.isSystem ? 'لا يمكن حذف صفحة نظام' : 'حذف'}
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

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  عرض {pages.length} من {meta.total} صفحة
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                  >
                    السابق
                  </button>
                  <span className="px-3 py-1">
                    {page} / {meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Translation Modal */}
      {showTranslationModal && selectedPage && (
        <TranslationModal
          page={selectedPage}
          onClose={() => {
            setShowTranslationModal(false);
            setSelectedPage(null);
          }}
        />
      )}
    </div>
  );
}

// Translation Modal Component
function TranslationModal({
  page,
  onClose,
}: {
  page: any;
  onClose: () => void;
}) {
  const [selectedLang, setSelectedLang] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    seoTitle: '',
    seoDescription: '',
  });
  const [editingTranslation, setEditingTranslation] = useState<any>(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => pagesApi.createTranslation(page.id, data),
    onSuccess: () => {
      toast.success('تم إضافة الترجمة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setSelectedLang('');
      setFormData({ title: '', content: '', excerpt: '', seoTitle: '', seoDescription: '' });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      pagesApi.updateTranslation(id, data),
    onSuccess: () => {
      toast.success('تم تحديث الترجمة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setEditingTranslation(null);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pagesApi.deleteTranslation(id),
    onSuccess: () => {
      toast.success('تم حذف الترجمة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const availableLanguages = languages.filter(
    (lang) =>
      lang.code !== page.language &&
      !page.translations?.some((t: any) => t.language === lang.code)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTranslation) {
      updateMutation.mutate({ id: editingTranslation.id, data: formData });
    } else {
      createMutation.mutate({ ...formData, language: selectedLang });
    }
  };

  const handleEdit = (translation: any) => {
    setEditingTranslation(translation);
    setFormData({
      title: translation.title,
      content: translation.content,
      excerpt: translation.excerpt || '',
      seoTitle: translation.seoTitle || '',
      seoDescription: translation.seoDescription || '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              إدارة ترجمات: {page.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Existing Translations */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">الترجمات الموجودة</h3>
              <div className="space-y-2">
                {/* Original Language */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {languages.find((l) => l.code === page.language)?.flag}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {languages.find((l) => l.code === page.language)?.name}
                      </p>
                      <p className="text-sm text-gray-500">اللغة الأصلية</p>
                    </div>
                  </div>
                  <span className="badge badge-success">أصلي</span>
                </div>

                {/* Translations */}
                {page.translations?.map((translation: any) => (
                  <div
                    key={translation.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {languages.find((l) => l.code === translation.language)?.flag}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{translation.title}</p>
                        <p className="text-sm text-gray-500">
                          {languages.find((l) => l.code === translation.language)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {translation.isReviewed ? (
                        <span className="badge badge-success">مراجع</span>
                      ) : (
                        <span className="badge badge-warning">بانتظار المراجعة</span>
                      )}
                      <button
                        onClick={() => handleEdit(translation)}
                        className="p-1 text-gray-400 hover:text-primary-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذه الترجمة؟')) {
                            deleteMutation.mutate(translation.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add/Edit Translation Form */}
            {(availableLanguages.length > 0 || editingTranslation) && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-medium text-gray-900">
                  {editingTranslation ? 'تعديل الترجمة' : 'إضافة ترجمة جديدة'}
                </h3>

                {!editingTranslation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اللغة
                    </label>
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">اختر اللغة</option>
                      {availableLanguages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المحتوى
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المقتطف
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      عنوان SEO
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, seoTitle: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      وصف SEO
                    </label>
                    <input
                      type="text"
                      value={formData.seoDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, seoDescription: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  {editingTranslation && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTranslation(null);
                        setFormData({
                          title: '',
                          content: '',
                          excerpt: '',
                          seoTitle: '',
                          seoDescription: '',
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      إلغاء
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : editingTranslation ? (
                      'تحديث'
                    ) : (
                      'إضافة'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

