import { useState } from 'react';
import OpenGraphPreview from './OpenGraphPreview';
import TwitterCardPreview from './TwitterCardPreview';
import SchemaEditor from './SchemaEditor';

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  schema?: any;
}

interface SEOEditorProps {
  data: SEOData;
  onChange: (data: SEOData) => void;
}

export default function SEOEditor({ data, onChange }: SEOEditorProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'og' | 'twitter' | 'schema'>('basic');

  const tabs = [
    { id: 'basic', label: 'أساسي' },
    { id: 'og', label: 'Facebook' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'schema', label: 'Schema.org' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">إعدادات SEO</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic SEO */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان SEO
              <span className="text-gray-500 text-xs mr-2">
                ({data.title?.length || 0}/60 حرف)
              </span>
            </label>
            <input
              type="text"
              value={data.title || ''}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
              maxLength={60}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="عنوان محسن لمحركات البحث"
            />
            {data.title && data.title.length > 60 && (
              <p className="text-red-600 text-sm mt-1">
                العنوان طويل جداً، يُفضل أن يكون أقل من 60 حرفاً
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف SEO
              <span className="text-gray-500 text-xs mr-2">
                ({data.description?.length || 0}/160 حرف)
              </span>
            </label>
            <textarea
              value={data.description || ''}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
              maxLength={160}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="وصف مختصر يظهر في نتائج البحث"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الكلمات المفتاحية
            </label>
            <input
              type="text"
              value={data.keywords?.join(', ') || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="كلمة1, كلمة2, كلمة3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canonical URL
            </label>
            <input
              type="url"
              value={data.canonicalUrl || ''}
              onChange={(e) => onChange({ ...data, canonicalUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="https://example.com/article"
            />
          </div>
        </div>
      )}

      {/* OpenGraph Preview */}
      {activeTab === 'og' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة Open Graph
            </label>
            <input
              type="url"
              value={data.ogImage || ''}
              onChange={(e) => onChange({ ...data, ogImage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <OpenGraphPreview
            title={data.title}
            description={data.description}
            image={data.ogImage}
          />
        </div>
      )}

      {/* Twitter Card Preview */}
      {activeTab === 'twitter' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع Twitter Card
            </label>
            <select
              value={data.twitterCard || 'summary_large_image'}
              onChange={(e) => onChange({ ...data, twitterCard: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="summary">ملخص</option>
              <option value="summary_large_image">ملخص مع صورة كبيرة</option>
            </select>
          </div>
          <TwitterCardPreview
            title={data.title}
            description={data.description}
            image={data.ogImage}
            cardType={data.twitterCard || 'summary_large_image'}
          />
        </div>
      )}

      {/* Schema.org */}
      {activeTab === 'schema' && (
        <SchemaEditor
          data={data.schema}
          onChange={(schema) => onChange({ ...data, schema })}
        />
      )}
    </div>
  );
}
