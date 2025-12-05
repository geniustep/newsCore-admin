import { useState, useEffect } from 'react';

interface SchemaEditorProps {
  data?: any;
  onChange: (schema: any) => void;
}

export default function SchemaEditor({ data, onChange }: SchemaEditorProps) {
  const [schemaType, setSchemaType] = useState<string>(data?.['@type'] || 'NewsArticle');
  const [headline, setHeadline] = useState<string>(data?.headline || '');
  const [description, setDescription] = useState<string>(data?.description || '');
  const [image, setImage] = useState<string>(data?.image || '');
  const [datePublished, setDatePublished] = useState<string>(
    data?.datePublished ? new Date(data.datePublished).toISOString().slice(0, 16) : ''
  );

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      headline: headline,
      description: description,
      image: image,
      datePublished: datePublished ? new Date(datePublished).toISOString() : new Date().toISOString(),
    };
    onChange(schema);
  }, [schemaType, headline, description, image, datePublished, onChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          نوع Schema
        </label>
        <select
          value={schemaType}
          onChange={(e) => setSchemaType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="NewsArticle">مقال إخباري</option>
          <option value="Article">مقال</option>
          <option value="BlogPosting">منشور مدونة</option>
          <option value="WebPage">صفحة ويب</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          العنوان (Headline)
        </label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الوصف (Description)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الصورة (Image URL)
        </label>
        <input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          تاريخ النشر
        </label>
        <input
          type="datetime-local"
          value={datePublished}
          onChange={(e) => setDatePublished(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          JSON Schema
        </label>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
          {JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': schemaType,
              headline: headline,
              description: description,
              image: image,
              datePublished: datePublished ? new Date(datePublished).toISOString() : new Date().toISOString(),
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
