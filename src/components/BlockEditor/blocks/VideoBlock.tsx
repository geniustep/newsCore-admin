interface VideoBlockProps {
  data: { url?: string; embedCode?: string; caption?: string };
  onChange: (data: any) => void;
}

export default function VideoBlock({ data, onChange }: VideoBlockProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">رابط الفيديو (YouTube, Vimeo, etc.)</label>
        <input
          type="url"
          value={data.url || ''}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">أو كود التضمين</label>
        <textarea
          value={data.embedCode || ''}
          onChange={(e) => onChange({ ...data, embedCode: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
          placeholder="<iframe>...</iframe>"
        />
      </div>

      {data.url && (
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">معاينة الفيديو</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">التعليق</label>
        <input
          type="text"
          value={data.caption || ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="تعليق على الفيديو"
        />
      </div>
    </div>
  );
}
