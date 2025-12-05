import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  LanguageIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  FolderIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import api from '../lib/api';

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag?: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
}

interface Namespace {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  moduleSlug?: string;
  themeSlug?: string;
}

interface Translation {
  id: string;
  key: string;
  value: string;
  isReviewed: boolean;
  isAuto: boolean;
  context?: string;
  namespace: Namespace;
  language: Language;
}

export default function TranslationManager() {
  const queryClient = useQueryClient();
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [showAddNamespace, setShowAddNamespace] = useState(false);
  const [showAddTranslation, setShowAddTranslation] = useState(false);
  const [newLanguage, setNewLanguage] = useState({
    code: '',
    name: '',
    nativeName: '',
    direction: 'ltr' as const,
    flag: '',
  });
  const [newNamespace, setNewNamespace] = useState({ name: '', description: '' });
  const [newTranslation, setNewTranslation] = useState({ key: '', value: '', context: '' });

  // Fetch languages
  const { data: languages } = useQuery<Language[]>({
    queryKey: ['languages'],
    queryFn: async () => {
      const res = await api.get('/i18n/languages');
      return res.data;
    },
  });

  // Fetch namespaces
  const { data: namespaces } = useQuery<Namespace[]>({
    queryKey: ['namespaces'],
    queryFn: async () => {
      const res = await api.get('/i18n/namespaces');
      return res.data;
    },
  });

  // Fetch translations
  const { data: translations, isLoading } = useQuery<Translation[]>({
    queryKey: ['translations', selectedNamespace, selectedLanguage, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedNamespace) params.append('namespace', selectedNamespace);
      if (selectedLanguage) params.append('languageCode', selectedLanguage);
      if (searchQuery) params.append('search', searchQuery);
      const res = await api.get(`/i18n/translations?${params}`);
      return res.data;
    },
    enabled: !!selectedNamespace || !!selectedLanguage,
  });

  // Fetch namespace stats
  const { data: stats } = useQuery({
    queryKey: ['namespace-stats', selectedNamespace],
    queryFn: async () => {
      const res = await api.get(`/i18n/namespaces/${selectedNamespace}/stats`);
      return res.data;
    },
    enabled: !!selectedNamespace,
  });

  // Create language mutation
  const createLanguageMutation = useMutation({
    mutationFn: async (data: typeof newLanguage) => {
      const res = await api.post('/i18n/languages', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      toast.success('تم إضافة اللغة');
      setShowAddLanguage(false);
      setNewLanguage({ code: '', name: '', nativeName: '', direction: 'ltr', flag: '' });
    },
    onError: () => {
      toast.error('فشل في إضافة اللغة');
    },
  });

  // Create namespace mutation
  const createNamespaceMutation = useMutation({
    mutationFn: async (data: typeof newNamespace) => {
      const res = await api.post('/i18n/namespaces', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['namespaces'] });
      toast.success('تم إضافة النطاق');
      setShowAddNamespace(false);
      setNewNamespace({ name: '', description: '' });
    },
  });

  // Create translation mutation
  const createTranslationMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/i18n/translations', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast.success('تم إضافة الترجمة');
      setShowAddTranslation(false);
      setNewTranslation({ key: '', value: '', context: '' });
    },
  });

  // Update translation mutation
  const updateTranslationMutation = useMutation({
    mutationFn: async ({ namespace, key, language, value }: any) => {
      const res = await api.put(`/i18n/translations/${namespace}/${key}/${language}`, { value });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast.success('تم تحديث الترجمة');
      setEditingKey(null);
    },
  });

  // Delete translation mutation
  const deleteTranslationMutation = useMutation({
    mutationFn: async ({ namespace, key, language }: any) => {
      await api.delete(`/i18n/translations/${namespace}/${key}/${language}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast.success('تم حذف الترجمة');
    },
  });

  const startEditing = (translation: Translation) => {
    setEditingKey(translation.id);
    setEditValue(translation.value);
  };

  const saveEdit = (translation: Translation) => {
    updateTranslationMutation.mutate({
      namespace: translation.namespace.name,
      key: translation.key,
      language: translation.language.code,
      value: editValue,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الترجمات</h1>
          <p className="text-gray-600 mt-1">تحكم كامل في لغات وترجمات الموقع</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddLanguage(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <LanguageIcon className="w-5 h-5" />
            إضافة لغة
          </button>
          <button
            onClick={() => setShowAddNamespace(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FolderIcon className="w-5 h-5" />
            إضافة نطاق
          </button>
        </div>
      </div>

      {/* Languages Overview */}
      <div className="bg-white rounded-lg border p-4">
        <h2 className="font-semibold mb-4">اللغات المتاحة</h2>
        <div className="flex flex-wrap gap-3">
          {languages?.map((lang) => (
            <div
              key={lang.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                lang.isActive ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <div>
                <div className="font-medium text-sm">{lang.nativeName}</div>
                <div className="text-xs text-gray-500">{lang.code}</div>
              </div>
              {lang.isDefault && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">افتراضي</span>
              )}
              {stats && stats[lang.code] && (
                <div className="text-xs text-gray-500">
                  {stats[lang.code].completionPercentage}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-wrap gap-4">
          {/* Namespace Select */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">النطاق</label>
            <select
              value={selectedNamespace}
              onChange={(e) => setSelectedNamespace(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">اختر نطاق...</option>
              {namespaces?.map((ns) => (
                <option key={ns.id} value={ns.name}>
                  {ns.name} {ns.isSystem && '(نظام)'}
                </option>
              ))}
            </select>
          </div>

          {/* Language Select */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">اللغة</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">جميع اللغات</option>
              {languages?.filter(l => l.isActive).map((lang) => (
                <option key={lang.id} value={lang.code}>
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">بحث</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المفاتيح والقيم..."
                className="w-full pl-10 pr-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        {selectedNamespace && selectedLanguage && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <button
              onClick={() => setShowAddTranslation(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="w-5 h-5" />
              إضافة ترجمة
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <ArrowUpTrayIcon className="w-5 h-5" />
              استيراد
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <ArrowDownTrayIcon className="w-5 h-5" />
              تصدير
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50">
              <SparklesIcon className="w-5 h-5" />
              ترجمة تلقائية (AI)
            </button>
          </div>
        )}
      </div>

      {/* Translations Table */}
      {(selectedNamespace || selectedLanguage) && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المفتاح</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">اللغة</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">القيمة</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    جاري التحميل...
                  </td>
                </tr>
              ) : translations?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    لا توجد ترجمات
                  </td>
                </tr>
              ) : (
                translations?.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{t.key}</code>
                      {t.context && (
                        <p className="text-xs text-gray-400 mt-1">{t.context}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        {t.language.flag} {t.language.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {editingKey === t.id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-2 py-1 border rounded"
                          autoFocus
                        />
                      ) : (
                        <span className="text-gray-700">{t.value}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {t.isReviewed && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                            مراجع
                          </span>
                        )}
                        {t.isAuto && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                            AI
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editingKey === t.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => saveEdit(t)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <CheckIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingKey(null)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditing(t)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('هل أنت متأكد من حذف هذه الترجمة؟')) {
                                deleteTranslationMutation.mutate({
                                  namespace: t.namespace.name,
                                  key: t.key,
                                  language: t.language.code,
                                });
                              }
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Language Modal */}
      {showAddLanguage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">إضافة لغة جديدة</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">رمز اللغة</label>
                <input
                  type="text"
                  value={newLanguage.code}
                  onChange={(e) => setNewLanguage(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="مثال: es, de, zh"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">اسم اللغة (بالإنجليزية)</label>
                <input
                  type="text"
                  value={newLanguage.name}
                  onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: Spanish, German"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">اسم اللغة (باللغة الأصلية)</label>
                <input
                  type="text"
                  value={newLanguage.nativeName}
                  onChange={(e) => setNewLanguage(prev => ({ ...prev, nativeName: e.target.value }))}
                  placeholder="مثال: Español, Deutsch"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">اتجاه الكتابة</label>
                <select
                  value={newLanguage.direction}
                  onChange={(e) => setNewLanguage(prev => ({ ...prev, direction: e.target.value as 'ltr' | 'rtl' }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="ltr">من اليسار لليمين (LTR)</option>
                  <option value="rtl">من اليمين لليسار (RTL)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">علم الدولة (Emoji)</label>
                <input
                  type="text"
                  value={newLanguage.flag}
                  onChange={(e) => setNewLanguage(prev => ({ ...prev, flag: e.target.value }))}
                  placeholder="🇪🇸"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddLanguage(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={() => createLanguageMutation.mutate(newLanguage)}
                disabled={createLanguageMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Namespace Modal */}
      {showAddNamespace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">إضافة نطاق جديد</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم النطاق</label>
                <input
                  type="text"
                  value={newNamespace.name}
                  onChange={(e) => setNewNamespace(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: articles, homepage"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <textarea
                  value={newNamespace.description}
                  onChange={(e) => setNewNamespace(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف اختياري للنطاق"
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddNamespace(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={() => createNamespaceMutation.mutate(newNamespace)}
                disabled={createNamespaceMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Translation Modal */}
      {showAddTranslation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">إضافة ترجمة جديدة</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">المفتاح</label>
                <input
                  type="text"
                  value={newTranslation.key}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="مثال: nav.home, buttons.save"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">القيمة</label>
                <input
                  type="text"
                  value={newTranslation.value}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="الترجمة"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">السياق (اختياري)</label>
                <textarea
                  value={newTranslation.context}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, context: e.target.value }))}
                  placeholder="سياق إضافي للمترجمين"
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddTranslation(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={() => createTranslationMutation.mutate({
                  ...newTranslation,
                  namespace: selectedNamespace,
                  languageCode: selectedLanguage,
                })}
                disabled={createTranslationMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
