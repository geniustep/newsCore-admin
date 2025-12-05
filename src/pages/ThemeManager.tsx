import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  PaintBrushIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  TrashIcon,
  ArrowPathIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import api from '../lib/api';

interface Theme {
  id: string;
  slug: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  previewImage?: string;
  isActive: boolean;
  isDefault: boolean;
  isSystem: boolean;
  features: string[];
  manifest: any;
  themeSettings: any[];
  installedAt: string;
  activatedAt?: string;
}

interface ThemeCustomizerField {
  id: string;
  type: string;
  label: string;
  description?: string;
  default?: any;
  options?: { value: string; label: string }[];
}

interface ThemeCustomizerSection {
  id: string;
  title: string;
  description?: string;
  fields: ThemeCustomizerField[];
}

export default function ThemeManager() {
  const queryClient = useQueryClient();
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customSettings, setCustomSettings] = useState<Record<string, any>>({});

  // Fetch themes
  const { data: themes, isLoading } = useQuery<Theme[]>({
    queryKey: ['themes'],
    queryFn: async () => {
      const res = await api.get('/themes');
      return res.data;
    },
  });

  // Activate theme mutation
  const activateMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await api.post(`/themes/${slug}/activate`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
      toast.success('تم تفعيل القالب بنجاح');
    },
    onError: () => {
      toast.error('فشل في تفعيل القالب');
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async ({ slug, settings }: { slug: string; settings: Record<string, any> }) => {
      const res = await api.put(`/themes/${slug}/settings`, { settings });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
      toast.success('تم حفظ الإعدادات');
      setShowCustomizer(false);
    },
    onError: () => {
      toast.error('فشل في حفظ الإعدادات');
    },
  });

  // Reset settings mutation
  const resetSettingsMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await api.post(`/themes/${slug}/settings/reset`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
      toast.success('تم إعادة الإعدادات للوضع الافتراضي');
    },
  });

  // Delete theme mutation
  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      await api.delete(`/themes/${slug}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
      toast.success('تم حذف القالب');
    },
    onError: () => {
      toast.error('فشل في حذف القالب');
    },
  });

  const openCustomizer = (theme: Theme) => {
    setSelectedTheme(theme);
    // Load current settings
    const settings: Record<string, any> = {};
    theme.themeSettings?.forEach((s: any) => {
      settings[s.key] = s.value;
    });
    // Merge with defaults from manifest
    const customizer = theme.manifest?.customizer;
    if (customizer?.sections) {
      customizer.sections.forEach((section: ThemeCustomizerSection) => {
        section.fields.forEach((field: ThemeCustomizerField) => {
          if (settings[field.id] === undefined && field.default !== undefined) {
            settings[field.id] = field.default;
          }
        });
      });
    }
    setCustomSettings(settings);
    setShowCustomizer(true);
  };

  const handleSettingChange = (key: string, value: any) => {
    setCustomSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    if (selectedTheme) {
      updateSettingsMutation.mutate({
        slug: selectedTheme.slug,
        settings: customSettings,
      });
    }
  };

  const renderField = (field: ThemeCustomizerField) => {
    const value = customSettings[field.id];

    switch (field.type) {
      case 'color':
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={value || field.default || '#000000'}
              onChange={(e) => handleSettingChange(field.id, e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value || field.default || ''}
              onChange={(e) => handleSettingChange(field.id, e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        );

      case 'select':
        return (
          <select
            value={value ?? field.default}
            onChange={(e) => handleSettingChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value ?? field.default ?? false}
              onChange={(e) => handleSettingChange(field.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value ?? field.default ?? 0}
            onChange={(e) => handleSettingChange(field.id, parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
          />
        );

      case 'text':
      default:
        return (
          <input
            type="text"
            value={value ?? field.default ?? ''}
            onChange={(e) => handleSettingChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة القوالب</h1>
          <p className="text-gray-600 mt-1">تخصيص مظهر موقعك</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <ArrowDownTrayIcon className="w-5 h-5" />
          تثبيت قالب جديد
        </button>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes?.map((theme) => (
          <div
            key={theme.id}
            className={`bg-white rounded-lg border-2 overflow-hidden ${
              theme.isActive ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            {/* Preview Image */}
            <div className="relative h-48 bg-gray-100">
              {theme.previewImage ? (
                <img
                  src={theme.previewImage}
                  alt={theme.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <PaintBrushIcon className="w-16 h-16 text-gray-300" />
                </div>
              )}
              {theme.isActive && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  مفعّل
                </div>
              )}
            </div>

            {/* Theme Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg">{theme.name}</h3>
              <p className="text-gray-500 text-sm mt-1">
                الإصدار {theme.version} {theme.author && `• بواسطة ${theme.author}`}
              </p>
              {theme.description && (
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{theme.description}</p>
              )}

              {/* Features */}
              <div className="flex flex-wrap gap-1 mt-3">
                {theme.features?.slice(0, 4).map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {feature}
                  </span>
                ))}
                {theme.features?.length > 4 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    +{theme.features.length - 4}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                {!theme.isActive && (
                  <button
                    onClick={() => activateMutation.mutate(theme.slug)}
                    disabled={activateMutation.isPending}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    تفعيل
                  </button>
                )}
                <button
                  onClick={() => openCustomizer(theme)}
                  className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  تخصيص
                </button>
                <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <EyeIcon className="w-4 h-4" />
                </button>
                {!theme.isSystem && !theme.isActive && (
                  <button
                    onClick={() => {
                      if (confirm('هل أنت متأكد من حذف هذا القالب؟')) {
                        deleteMutation.mutate(theme.slug);
                      }
                    }}
                    className="flex items-center justify-center px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Theme Customizer Modal */}
      {showCustomizer && selectedTheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">تخصيص {selectedTheme.name}</h2>
                <p className="text-gray-500 text-sm">تعديل إعدادات القالب</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => resetSettingsMutation.mutate(selectedTheme.slug)}
                  className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  إعادة ضبط
                </button>
                <button
                  onClick={() => setShowCustomizer(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  onClick={saveSettings}
                  disabled={updateSettingsMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {updateSettingsMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-8">
                {selectedTheme.manifest?.customizer?.sections?.map((section: ThemeCustomizerSection) => (
                  <div key={section.id} className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{section.title}</h3>
                      {section.description && (
                        <p className="text-gray-500 text-sm">{section.description}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                          </label>
                          {renderField(field)}
                          {field.description && (
                            <p className="text-xs text-gray-500">{field.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
