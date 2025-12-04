import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { pagesApi } from '../lib/api';
import {
  ArrowRightIcon,
  CloudArrowUpIcon,
  HomeIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

interface PageForm {
  title: string;
  content: string;
  excerpt: string;
  status: string;
  language: string;
  template: string;
  parentId: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  isHomepage: boolean;
  showInMenu: boolean;
  allowComments: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const templates = [
  { value: 'default', label: 'افتراضي', description: 'تخطيط قياسي للصفحات' },
  { value: 'full-width', label: 'عرض كامل', description: 'بدون أشرطة جانبية' },
  { value: 'sidebar', label: 'مع شريط جانبي', description: 'شريط جانبي للتنقل' },
  { value: 'contact', label: 'تواصل', description: 'صفحة تواصل مع نموذج' },
  { value: 'about', label: 'من نحن', description: 'صفحة تعريفية' },
  { value: 'landing', label: 'صفحة هبوط', description: 'تصميم تسويقي' },
];

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function PageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<PageForm>({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      status: 'DRAFT',
      language: 'ar',
      template: 'default',
      parentId: '',
      featuredImageUrl: '',
      featuredImageAlt: '',
      isHomepage: false,
      showInMenu: false,
      allowComments: false,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    },
  });

  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ['page', id],
    queryFn: () => pagesApi.getOne(id!),
    enabled: isEditing,
  });

  const { data: pagesTree } = useQuery({
    queryKey: ['pages-tree'],
    queryFn: () => pagesApi.getTree(),
  });

  useEffect(() => {
    if (page) {
      const data = (page as any).data;
      reset({
        title: data.title,
        content: data.content || '',
        excerpt: data.excerpt || '',
        status: data.status,
        language: data.language || 'ar',
        template: data.template || 'default',
        parentId: data.parent?.id || '',
        featuredImageUrl: data.featuredImageUrl || '',
        featuredImageAlt: data.featuredImageAlt || '',
        isHomepage: data.isHomepage || false,
        showInMenu: data.showInMenu || false,
        allowComments: data.allowComments || false,
        seoTitle: data.seo?.title || '',
        seoDescription: data.seo?.description || '',
        seoKeywords: data.seo?.keywords?.join(', ') || '',
      });
    }
  }, [page, reset]);

  const createMutation = useMutation({
    mutationFn: (data: any) => pagesApi.create(data),
    onSuccess: () => {
      toast.success('تم إنشاء الصفحة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      navigate('/pages');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => pagesApi.update(id!, data),
    onSuccess: () => {
      toast.success('تم تحديث الصفحة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', id] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const publishMutation = useMutation({
    mutationFn: () => pagesApi.publish(id!),
    onSuccess: () => {
      toast.success('تم نشر الصفحة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', id] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: PageForm) => {
    const payload = {
      title: data.title,
      content: data.content,
      contentHtml: data.content,
      excerpt: data.excerpt || undefined,
      status: data.status,
      language: data.language,
      template: data.template,
      parentId: data.parentId || undefined,
      featuredImageUrl: data.featuredImageUrl || undefined,
      featuredImageAlt: data.featuredImageAlt || undefined,
      isHomepage: data.isHomepage,
      showInMenu: data.showInMenu,
      allowComments: data.allowComments,
      seoTitle: data.seoTitle || undefined,
      seoDescription: data.seoDescription || undefined,
      seoKeywords: data.seoKeywords
        ? data.seoKeywords.split(',').map((k) => k.trim()).filter(Boolean)
        : undefined,
    };

    if (isEditing) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;
  const currentStatus = watch('status');
  const pageData = (page as any)?.data;

  // Flatten pages tree for parent selection
  const flattenPages = (pages: any[], level = 0): { id: string; title: string; level: number }[] => {
    const result: { id: string; title: string; level: number }[] = [];
    for (const p of pages || []) {
      if (p.id !== id) {
        result.push({ id: p.id, title: p.title, level });
        if (p.children?.length) {
          result.push(...flattenPages(p.children, level + 1));
        }
      }
    }
    return result;
  };

  const parentOptions = flattenPages((pagesTree as any)?.data || []);

  if (isEditing && pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pages')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'تعديل الصفحة' : 'صفحة جديدة'}
            </h1>
            {isEditing && pageData && (
              <p className="text-gray-500 text-sm mt-1">
                /{pageData.slug}
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          {isEditing && currentStatus === 'DRAFT' && (
            <button
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              نشر الصفحة
            </button>
          )}
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={saving || !isDirty}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 spinner" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="w-5 h-5" />
                حفظ
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الصفحة *
                </label>
                <input
                  {...register('title', { required: 'العنوان مطلوب' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xl font-medium"
                  placeholder="أدخل عنوان الصفحة"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="border-b">
                <nav className="flex -mb-px">
                  <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'content'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <DocumentTextIcon className="w-4 h-4 inline-block ml-2" />
                    المحتوى
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('seo')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'seo'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <MagnifyingGlassIcon className="w-4 h-4 inline-block ml-2" />
                    SEO
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'settings'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Cog6ToothIcon className="w-4 h-4 inline-block ml-2" />
                    الإعدادات
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        محتوى الصفحة *
                      </label>
                      <Controller
                        name="content"
                        control={control}
                        rules={{ required: 'المحتوى مطلوب' }}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            className="h-96"
                            modules={{
                              toolbar: [
                                [{ header: [1, 2, 3, 4, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                [{ align: [] }],
                                [{ direction: 'rtl' }],
                                ['blockquote', 'code-block'],
                                ['link', 'image', 'video'],
                                [{ color: [] }, { background: [] }],
                                ['clean'],
                              ],
                            }}
                            placeholder="اكتب محتوى الصفحة هنا..."
                          />
                        )}
                      />
                      {errors.content && (
                        <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                      )}
                    </div>

                    <div className="pt-12">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المقتطف
                      </label>
                      <textarea
                        {...register('excerpt')}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="ملخص قصير للصفحة (اختياري)"
                      />
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عنوان SEO
                      </label>
                      <input
                        {...register('seoTitle')}
                        maxLength={70}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="عنوان مخصص لمحركات البحث"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {watch('seoTitle')?.length || 0}/70 حرف
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        وصف SEO
                      </label>
                      <textarea
                        {...register('seoDescription')}
                        maxLength={160}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="وصف مخصص لمحركات البحث"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {watch('seoDescription')?.length || 0}/160 حرف
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الكلمات المفتاحية
                      </label>
                      <input
                        {...register('seoKeywords')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="كلمة1, كلمة2, كلمة3"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        افصل بين الكلمات بفاصلة
                      </p>
                    </div>

                    {/* SEO Preview */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-2">معاينة في محركات البحث:</p>
                      <div className="bg-white rounded border p-3">
                        <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                          {watch('seoTitle') || watch('title') || 'عنوان الصفحة'}
                        </p>
                        <p className="text-green-700 text-sm">
                          example.com/{pageData?.slug || 'page-slug'}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {watch('seoDescription') || watch('excerpt') || 'وصف الصفحة سيظهر هنا...'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الصفحة الأب
                        </label>
                        <select
                          {...register('parentId')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">بدون (صفحة رئيسية)</option>
                          {parentOptions.map((p) => (
                            <option key={p.id} value={p.id}>
                              {'—'.repeat(p.level)} {p.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ترتيب العرض
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          {...register('isHomepage')}
                          className="rounded text-primary-600 focus:ring-primary-500"
                        />
                        <div className="flex items-center gap-2">
                          <HomeIcon className="w-5 h-5 text-amber-500" />
                          <div>
                            <p className="font-medium text-gray-900">صفحة رئيسية</p>
                            <p className="text-sm text-gray-500">
                              تعيين كصفحة البداية للموقع
                            </p>
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          {...register('showInMenu')}
                          className="rounded text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">إظهار في القائمة</p>
                          <p className="text-sm text-gray-500">
                            إضافة رابط للصفحة في قائمة التنقل
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          {...register('allowComments')}
                          className="rounded text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">السماح بالتعليقات</p>
                          <p className="text-sm text-gray-500">
                            تفعيل التعليقات على هذه الصفحة
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Box */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CloudArrowUpIcon className="w-5 h-5" />
                النشر
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="DRAFT">مسودة</option>
                  <option value="PUBLISHED">منشور</option>
                  <option value="ARCHIVED">مؤرشف</option>
                </select>
              </div>

              {isEditing && pageData && (
                <div className="text-sm text-gray-500 space-y-1 pt-2 border-t">
                  <p>
                    <span className="font-medium">تاريخ الإنشاء:</span>{' '}
                    {new Date(pageData.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                  {pageData.publishedAt && (
                    <p>
                      <span className="font-medium">تاريخ النشر:</span>{' '}
                      {new Date(pageData.publishedAt).toLocaleDateString('ar-SA')}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">آخر تحديث:</span>{' '}
                    {new Date(pageData.updatedAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              )}
            </div>

            {/* Language */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <GlobeAltIcon className="w-5 h-5" />
                اللغة
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <label
                    key={lang.code}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      watch('language') === lang.code
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('language')}
                      value={lang.code}
                      className="sr-only"
                    />
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-xs font-medium">{lang.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Template */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">القالب</h3>
              <div className="space-y-2">
                {templates.map((template) => (
                  <label
                    key={template.value}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      watch('template') === template.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('template')}
                      value={template.value}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{template.label}</p>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <PhotoIcon className="w-5 h-5" />
                الصورة البارزة
              </h3>
              <div>
                <input
                  {...register('featuredImageUrl')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="رابط الصورة"
                />
              </div>
              {watch('featuredImageUrl') && (
                <>
                  <img
                    src={watch('featuredImageUrl')}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <input
                    {...register('featuredImageAlt')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder="النص البديل للصورة"
                  />
                </>
              )}
            </div>

            {/* Translations Info */}
            {isEditing && pageData?.translations?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">الترجمات</h3>
                <div className="space-y-2">
                  {pageData.translations.map((t: any) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {languages.find((l) => l.code === t.language)?.flag}{' '}
                        {languages.find((l) => l.code === t.language)?.name}
                      </span>
                      <span
                        className={`badge ${
                          t.isReviewed ? 'badge-success' : 'badge-warning'
                        }`}
                      >
                        {t.isReviewed ? 'مراجع' : 'بانتظار المراجعة'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

