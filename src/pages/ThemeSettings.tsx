import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { settingsApi } from '../lib/api';
import {
  PhotoIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  SparklesIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  EyeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface ThemeSettings {
  // Logos
  logoAr: string;
  logoEn: string;
  logoFr: string;
  favicon: string;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;

  // Typography
  fontFamily: string;
  fontSize: string;
  headingFont: string;

  // Layout
  borderRadius: string;
  spacing: string;

  // Dark Mode
  darkModeEnabled: boolean;
  darkPrimaryColor: string;
  darkBackgroundColor: string;
  darkTextColor: string;
}

const themePresets = [
  {
    name: 'الافتراضي',
    colors: {
      primaryColor: '#ed7520',
      secondaryColor: '#0ea5e9',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
    },
  },
  {
    name: 'الأزرق الاحترافي',
    colors: {
      primaryColor: '#2563eb',
      secondaryColor: '#0891b2',
      accentColor: '#06b6d4',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
    },
  },
  {
    name: 'الأخضر الطبيعي',
    colors: {
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      accentColor: '#34d399',
      backgroundColor: '#ffffff',
      textColor: '#064e3b',
    },
  },
  {
    name: 'البنفسجي الحديث',
    colors: {
      primaryColor: '#7c3aed',
      secondaryColor: '#a78bfa',
      accentColor: '#c4b5fd',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
    },
  },
  {
    name: 'الوردي الناعم',
    colors: {
      primaryColor: '#ec4899',
      secondaryColor: '#f472b6',
      accentColor: '#fbcfe8',
      backgroundColor: '#ffffff',
      textColor: '#831843',
    },
  },
  {
    name: 'الداكن الأنيق',
    colors: {
      primaryColor: '#f59e0b',
      secondaryColor: '#fbbf24',
      accentColor: '#fcd34d',
      backgroundColor: '#111827',
      textColor: '#f9fafb',
    },
  },
];

const fontOptions = [
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex Sans Arabic' },
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Tajawal', label: 'Tajawal' },
  { value: 'Almarai', label: 'Almarai' },
  { value: 'Noto Sans Arabic', label: 'Noto Sans Arabic' },
  { value: 'Amiri', label: 'Amiri' },
];

export default function ThemeSettings() {
  const [activeTab, setActiveTab] = useState<'logos' | 'colors' | 'typography' | 'advanced'>('logos');
  const [previewMode, setPreviewMode] = useState(false);
  const { theme, updateTheme } = useTheme();
  const queryClient = useQueryClient();

  // Fetch theme settings from backend
  const { data: backendTheme } = useQuery({
    queryKey: ['themeSettings'],
    queryFn: async () => {
      const response = await settingsApi.getTheme();
      return response as ThemeSettings;
    },
  });

  // Mutation to save theme settings to backend
  const saveMutation = useMutation({
    mutationFn: (data: ThemeSettings) => settingsApi.updateTheme(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themeSettings'] });
      toast.success('تم حفظ إعدادات القالب بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء الحفظ');
    },
  });

  const { register, watch, setValue, handleSubmit, reset } = useForm<ThemeSettings>({
    defaultValues: theme,
  });

  // Update form when backend theme is loaded
  useEffect(() => {
    if (backendTheme) {
      reset(backendTheme as ThemeSettings);
      updateTheme(backendTheme as ThemeSettings);
    }
  }, [backendTheme, reset, updateTheme]);

  // Update form when theme changes
  useEffect(() => {
    reset(theme);
  }, [theme, reset]);

  const formData = watch();

  const applyPreset = (preset: typeof themePresets[0]) => {
    Object.entries(preset.colors).forEach(([key, value]) => {
      setValue(key as keyof ThemeSettings, value);
    });
    toast.success(`تم تطبيق قالب "${preset.name}"`);
  };

  const exportTheme = () => {
    const themeData = JSON.stringify(formData, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme-settings.json';
    a.click();
    toast.success('تم تصدير إعدادات القالب');
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const theme = JSON.parse(e.target?.result as string);
          Object.entries(theme).forEach(([key, value]) => {
            setValue(key as keyof ThemeSettings, value as any);
          });
          toast.success('تم استيراد إعدادات القالب بنجاح');
        } catch (error) {
          toast.error('خطأ في قراءة ملف الإعدادات');
        }
      };
      reader.readAsText(file);
    }
  };

  const onSubmit = (data: ThemeSettings) => {
    // Save to local state
    updateTheme(data);
    // Save to backend
    saveMutation.mutate(data);
  };

  const tabs = [
    { id: 'logos' as const, label: 'الشعارات', icon: PhotoIcon },
    { id: 'colors' as const, label: 'الألوان', icon: PaintBrushIcon },
    { id: 'typography' as const, label: 'الخطوط', icon: SparklesIcon },
    { id: 'advanced' as const, label: 'متقدم', icon: Cog6ToothIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إعدادات القالب</h1>
          <p className="text-gray-500 mt-1">تخصيص مظهر وألوان الموقع</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Import/Export */}
          <input
            type="file"
            id="import-theme"
            accept=".json"
            onChange={importTheme}
            className="hidden"
          />
          <label
            htmlFor="import-theme"
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DocumentArrowUpIcon className="w-5 h-5" />
            استيراد
          </label>

          <button
            type="button"
            onClick={exportTheme}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            تصدير
          </button>

          {/* Preview Toggle */}
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              previewMode
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <EyeIcon className="w-5 h-5" />
            {previewMode ? 'إخفاء المعاينة' : 'معاينة'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className={previewMode ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Tabs */}
            <div className="border-b">
              <nav className="flex -mb-px">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              {/* Logos Tab */}
              {activeTab === 'logos' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      الشعارات حسب اللغة
                    </h3>
                    <div className="space-y-4">
                      {/* Arabic Logo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الشعار العربي
                        </label>
                        <input
                          {...register('logoAr')}
                          type="url"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="https://example.com/logo-ar.png"
                        />
                        {formData.logoAr && (
                          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                            <img
                              src={formData.logoAr}
                              alt="Arabic Logo"
                              className="h-16 object-contain"
                            />
                          </div>
                        )}
                      </div>

                      {/* English Logo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الشعار الإنجليزي
                        </label>
                        <input
                          {...register('logoEn')}
                          type="url"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="https://example.com/logo-en.png"
                        />
                        {formData.logoEn && (
                          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                            <img
                              src={formData.logoEn}
                              alt="English Logo"
                              className="h-16 object-contain"
                            />
                          </div>
                        )}
                      </div>

                      {/* French Logo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الشعار الفرنسي
                        </label>
                        <input
                          {...register('logoFr')}
                          type="url"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="https://example.com/logo-fr.png"
                        />
                        {formData.logoFr && (
                          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                            <img
                              src={formData.logoFr}
                              alt="French Logo"
                              className="h-16 object-contain"
                            />
                          </div>
                        )}
                      </div>

                      {/* Favicon */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          أيقونة الموقع (Favicon)
                        </label>
                        <input
                          {...register('favicon')}
                          type="url"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="https://example.com/favicon.ico"
                        />
                        {formData.favicon && (
                          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                            <img
                              src={formData.favicon}
                              alt="Favicon"
                              className="h-8 w-8 object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Colors Tab */}
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  {/* Theme Presets */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      قوالب جاهزة
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {themePresets.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors group"
                        >
                          <div className="flex gap-2 mb-2">
                            {Object.values(preset.colors).slice(0, 4).map((color, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                            {preset.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Pickers */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      الألوان المخصصة
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Primary Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اللون الأساسي
                        </label>
                        <div className="flex gap-3">
                          <input
                            {...register('primaryColor')}
                            type="color"
                            className="h-12 w-12 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.primaryColor}
                            onChange={(e) => setValue('primaryColor', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                          />
                        </div>
                      </div>

                      {/* Secondary Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اللون الثانوي
                        </label>
                        <div className="flex gap-3">
                          <input
                            {...register('secondaryColor')}
                            type="color"
                            className="h-12 w-12 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.secondaryColor}
                            onChange={(e) => setValue('secondaryColor', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                          />
                        </div>
                      </div>

                      {/* Accent Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          لون التمييز
                        </label>
                        <div className="flex gap-3">
                          <input
                            {...register('accentColor')}
                            type="color"
                            className="h-12 w-12 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.accentColor}
                            onChange={(e) => setValue('accentColor', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                          />
                        </div>
                      </div>

                      {/* Background Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          لون الخلفية
                        </label>
                        <div className="flex gap-3">
                          <input
                            {...register('backgroundColor')}
                            type="color"
                            className="h-12 w-12 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.backgroundColor}
                            onChange={(e) => setValue('backgroundColor', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                          />
                        </div>
                      </div>

                      {/* Text Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          لون النص
                        </label>
                        <div className="flex gap-3">
                          <input
                            {...register('textColor')}
                            type="color"
                            className="h-12 w-12 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.textColor}
                            onChange={(e) => setValue('textColor', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dark Mode */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        الوضع الداكن
                      </h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('darkModeEnabled')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900">
                          تفعيل
                        </span>
                      </label>
                    </div>

                    {formData.darkModeEnabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            اللون الأساسي (داكن)
                          </label>
                          <div className="flex gap-3">
                            <input
                              {...register('darkPrimaryColor')}
                              type="color"
                              className="h-12 w-12 rounded border border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formData.darkPrimaryColor}
                              onChange={(e) => setValue('darkPrimaryColor', e.target.value)}
                              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            لون الخلفية (داكن)
                          </label>
                          <div className="flex gap-3">
                            <input
                              {...register('darkBackgroundColor')}
                              type="color"
                              className="h-12 w-12 rounded border border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formData.darkBackgroundColor}
                              onChange={(e) => setValue('darkBackgroundColor', e.target.value)}
                              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            لون النص (داكن)
                          </label>
                          <div className="flex gap-3">
                            <input
                              {...register('darkTextColor')}
                              type="color"
                              className="h-12 w-12 rounded border border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formData.darkTextColor}
                              onChange={(e) => setValue('darkTextColor', e.target.value)}
                              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Typography Tab */}
              {activeTab === 'typography' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      إعدادات الخطوط
                    </h3>
                    <div className="space-y-4">
                      {/* Font Family */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          خط النصوص
                        </label>
                        <select
                          {...register('fontFamily')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {fontOptions.map((font) => (
                            <option key={font.value} value={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </select>
                        <p
                          className="mt-2 p-3 bg-gray-50 rounded text-lg"
                          style={{ fontFamily: formData.fontFamily }}
                        >
                          مثال على النص: هذا نص تجريبي لمعاينة الخط
                        </p>
                      </div>

                      {/* Heading Font */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          خط العناوين
                        </label>
                        <select
                          {...register('headingFont')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {fontOptions.map((font) => (
                            <option key={font.value} value={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </select>
                        <h2
                          className="mt-2 p-3 bg-gray-50 rounded text-2xl font-bold"
                          style={{ fontFamily: formData.headingFont }}
                        >
                          عنوان تجريبي
                        </h2>
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          حجم الخط الأساسي
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="12"
                            max="20"
                            step="1"
                            value={parseInt(formData.fontSize)}
                            onChange={(e) => setValue('fontSize', `${e.target.value}px`)}
                            className="flex-1"
                          />
                          <input
                            {...register('fontSize')}
                            type="text"
                            className="w-20 px-4 py-2 border border-gray-300 rounded-lg text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      إعدادات متقدمة
                    </h3>
                    <div className="space-y-4">
                      {/* Border Radius */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          تقوس الحواف
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={parseFloat(formData.borderRadius)}
                            onChange={(e) => setValue('borderRadius', `${e.target.value}rem`)}
                            className="flex-1"
                          />
                          <input
                            {...register('borderRadius')}
                            type="text"
                            className="w-24 px-4 py-2 border border-gray-300 rounded-lg text-center"
                          />
                        </div>
                        <div className="mt-3 flex gap-3">
                          <div
                            className="w-20 h-20 bg-primary-600"
                            style={{ borderRadius: formData.borderRadius }}
                          />
                          <p className="text-sm text-gray-600 self-center">
                            معاينة التقوس
                          </p>
                        </div>
                      </div>

                      {/* Spacing */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          المسافات
                        </label>
                        <select
                          {...register('spacing')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="compact">مضغوط</option>
                          <option value="normal">عادي</option>
                          <option value="relaxed">مريح</option>
                          <option value="spacious">واسع</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    // Reset to default
                    toast('إعادة تعيين الإعدادات الافتراضية');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إعادة تعيين
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  حفظ الإعدادات
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Preview */}
        {previewMode && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                المعاينة المباشرة
              </h3>

              <div
                className="p-6 rounded-lg border-2 space-y-4"
                style={{
                  backgroundColor: formData.backgroundColor,
                  color: formData.textColor,
                  fontFamily: formData.fontFamily,
                  fontSize: formData.fontSize,
                  borderRadius: formData.borderRadius,
                }}
              >
                {/* Logo Preview */}
                {formData.logoAr && (
                  <div className="mb-4">
                    <img
                      src={formData.logoAr}
                      alt="Logo"
                      className="h-12 object-contain"
                    />
                  </div>
                )}

                {/* Heading */}
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{
                    color: formData.primaryColor,
                    fontFamily: formData.headingFont,
                  }}
                >
                  عنوان تجريبي
                </h1>

                {/* Paragraph */}
                <p className="mb-3">
                  هذا نص تجريبي لمعاينة الخط والألوان المختارة. يمكنك رؤية كيف ستظهر
                  النصوص في الموقع.
                </p>

                {/* Button */}
                <button
                  className="px-4 py-2 text-white rounded-lg transition-colors"
                  style={{
                    backgroundColor: formData.primaryColor,
                    borderRadius: formData.borderRadius,
                  }}
                >
                  زر تجريبي
                </button>

                {/* Secondary Button */}
                <button
                  className="px-4 py-2 mr-2 text-white rounded-lg transition-colors"
                  style={{
                    backgroundColor: formData.secondaryColor,
                    borderRadius: formData.borderRadius,
                  }}
                >
                  زر ثانوي
                </button>

                {/* Accent Element */}
                <div
                  className="p-3 rounded-lg mt-4"
                  style={{
                    backgroundColor: formData.accentColor + '20',
                    borderLeft: `4px solid ${formData.accentColor}`,
                    borderRadius: formData.borderRadius,
                  }}
                >
                  <p className="text-sm">عنصر مميز مع لون التمييز</p>
                </div>

                {/* Dark Mode Preview */}
                {formData.darkModeEnabled && (
                  <div
                    className="p-4 rounded-lg mt-4"
                    style={{
                      backgroundColor: formData.darkBackgroundColor,
                      color: formData.darkTextColor,
                      borderRadius: formData.borderRadius,
                    }}
                  >
                    <p className="text-sm font-semibold mb-2">الوضع الداكن</p>
                    <p className="text-xs">معاينة الألوان في الوضع الداكن</p>
                    <button
                      className="px-3 py-1 text-sm mt-2 rounded"
                      style={{
                        backgroundColor: formData.darkPrimaryColor,
                        borderRadius: formData.borderRadius,
                      }}
                    >
                      زر داكن
                    </button>
                  </div>
                )}
              </div>

              {/* Color Palette */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">لوحة الألوان</p>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: formData.primaryColor }}
                    title="أساسي"
                  />
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: formData.secondaryColor }}
                    title="ثانوي"
                  />
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: formData.accentColor }}
                    title="تمييز"
                  />
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: formData.backgroundColor }}
                    title="خلفية"
                  />
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: formData.textColor }}
                    title="نص"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
