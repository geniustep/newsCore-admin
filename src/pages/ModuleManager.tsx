import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  PuzzlePieceIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PlayIcon,
  StopIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import api from '../lib/api';

interface Module {
  id: string;
  slug: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  icon?: string;
  type: 'CORE' | 'EXTENSION' | 'WIDGET' | 'INTEGRATION';
  isEnabled: boolean;
  isInstalled: boolean;
  isCore: boolean;
  isSystem: boolean;
  dependencies: string[];
  manifest: any;
  moduleSettings: any[];
  installedAt?: string;
  enabledAt?: string;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  CORE: { label: 'أساسي', color: 'bg-purple-100 text-purple-700' },
  EXTENSION: { label: 'إضافة', color: 'bg-blue-100 text-blue-700' },
  WIDGET: { label: 'ودجت', color: 'bg-green-100 text-green-700' },
  INTEGRATION: { label: 'تكامل', color: 'bg-orange-100 text-orange-700' },
};

export default function ModuleManager() {
  const queryClient = useQueryClient();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [moduleSettings, setModuleSettings] = useState<Record<string, any>>({});

  // Fetch modules
  const { data: modules, isLoading } = useQuery<Module[]>({
    queryKey: ['modules'],
    queryFn: async () => {
      const res = await api.get('/modules');
      return res.data;
    },
  });

  // Enable module mutation
  const enableMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await api.post(`/modules/${slug}/enable`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast.success('تم تفعيل الوحدة');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل في تفعيل الوحدة');
    },
  });

  // Disable module mutation
  const disableMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await api.post(`/modules/${slug}/disable`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast.success('تم تعطيل الوحدة');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل في تعطيل الوحدة');
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async ({ slug, settings }: { slug: string; settings: Record<string, any> }) => {
      const res = await api.put(`/modules/${slug}/settings`, { settings });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast.success('تم حفظ الإعدادات');
      setShowSettings(false);
    },
  });

  // Uninstall module mutation
  const uninstallMutation = useMutation({
    mutationFn: async (slug: string) => {
      await api.delete(`/modules/${slug}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast.success('تم حذف الوحدة');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل في حذف الوحدة');
    },
  });

  const openSettings = (module: Module) => {
    setSelectedModule(module);
    // Load current settings
    const settings: Record<string, any> = {};
    module.moduleSettings?.forEach((s: any) => {
      settings[s.key] = s.value;
    });
    setModuleSettings(settings);
    setShowSettings(true);
  };

  const filteredModules = modules?.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'enabled') return m.isEnabled;
    if (filter === 'disabled') return !m.isEnabled;
    return m.type === filter;
  });

  const counts = {
    all: modules?.length || 0,
    enabled: modules?.filter(m => m.isEnabled).length || 0,
    disabled: modules?.filter(m => !m.isEnabled).length || 0,
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة الوحدات</h1>
          <p className="text-gray-600 mt-1">إضافة وتعديل وظائف النظام</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <ArrowDownTrayIcon className="w-5 h-5" />
          تثبيت وحدة جديدة
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          الكل ({counts.all})
        </button>
        <button
          onClick={() => setFilter('enabled')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'enabled' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          المفعّلة ({counts.enabled})
        </button>
        <button
          onClick={() => setFilter('disabled')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'disabled' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          المعطّلة ({counts.disabled})
        </button>
        <div className="border-l border-gray-300 mx-2" />
        {Object.entries(typeLabels).map(([type, { label }]) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg ${
              filter === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Modules List */}
      <div className="bg-white rounded-lg border divide-y">
        {filteredModules?.map((module) => (
          <div
            key={module.id}
            className="p-4 flex items-center gap-4 hover:bg-gray-50"
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              module.isEnabled ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {module.icon ? (
                <span className="text-2xl">{module.icon}</span>
              ) : (
                <PuzzlePieceIcon className={`w-6 h-6 ${
                  module.isEnabled ? 'text-blue-600' : 'text-gray-400'
                }`} />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{module.name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs ${typeLabels[module.type]?.color}`}>
                  {typeLabels[module.type]?.label}
                </span>
                {module.isCore && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    ضروري
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-0.5">
                v{module.version} {module.author && `• بواسطة ${module.author}`}
              </p>
              {module.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-1">{module.description}</p>
              )}
              {module.dependencies?.length > 0 && (
                <p className="text-gray-400 text-xs mt-1">
                  يعتمد على: {module.dependencies.join(', ')}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              {module.isEnabled ? (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircleIcon className="w-4 h-4" />
                  مفعّل
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-400 text-sm">
                  <XCircleIcon className="w-4 h-4" />
                  معطّل
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {module.isEnabled ? (
                <button
                  onClick={() => disableMutation.mutate(module.slug)}
                  disabled={module.isSystem || disableMutation.isPending}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                    module.isSystem
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  <StopIcon className="w-4 h-4" />
                  تعطيل
                </button>
              ) : (
                <button
                  onClick={() => enableMutation.mutate(module.slug)}
                  disabled={enableMutation.isPending}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                >
                  <PlayIcon className="w-4 h-4" />
                  تفعيل
                </button>
              )}
              <button
                onClick={() => openSettings(module)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded">
                <InformationCircleIcon className="w-5 h-5" />
              </button>
              {!module.isCore && !module.isSystem && (
                <button
                  onClick={() => {
                    if (confirm('هل أنت متأكد من حذف هذه الوحدة؟')) {
                      uninstallMutation.mutate(module.slug);
                    }
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredModules?.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            لا توجد وحدات تطابق الفلتر المحدد
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">إعدادات {selectedModule.name}</h2>
                <p className="text-gray-500 text-sm">تخصيص إعدادات الوحدة</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => updateSettingsMutation.mutate({
                    slug: selectedModule.slug,
                    settings: moduleSettings,
                  })}
                  disabled={updateSettingsMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  حفظ
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedModule.manifest?.settings?.length > 0 ? (
                <div className="space-y-4">
                  {selectedModule.manifest.settings.map((setting: any) => (
                    <div key={setting.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {setting.label}
                        {setting.required && <span className="text-red-500">*</span>}
                      </label>
                      {setting.type === 'boolean' ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={moduleSettings[setting.key] ?? setting.default ?? false}
                            onChange={(e) => setModuleSettings(prev => ({
                              ...prev,
                              [setting.key]: e.target.checked,
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      ) : setting.type === 'select' ? (
                        <select
                          value={moduleSettings[setting.key] ?? setting.default}
                          onChange={(e) => setModuleSettings(prev => ({
                            ...prev,
                            [setting.key]: e.target.value,
                          }))}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          {setting.options?.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : setting.type === 'textarea' ? (
                        <textarea
                          value={moduleSettings[setting.key] ?? setting.default ?? ''}
                          onChange={(e) => setModuleSettings(prev => ({
                            ...prev,
                            [setting.key]: e.target.value,
                          }))}
                          className="w-full px-3 py-2 border rounded-lg"
                          rows={4}
                        />
                      ) : (
                        <input
                          type={setting.type === 'password' ? 'password' : 'text'}
                          value={moduleSettings[setting.key] ?? setting.default ?? ''}
                          onChange={(e) => setModuleSettings(prev => ({
                            ...prev,
                            [setting.key]: e.target.value,
                          }))}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      )}
                      {setting.description && (
                        <p className="text-xs text-gray-500 mt-1">{setting.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  لا توجد إعدادات قابلة للتخصيص لهذه الوحدة
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
