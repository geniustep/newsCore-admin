interface EmbedBlockProps {
  data: { embedCode?: string; url?: string };
  onChange: (data: any) => void;
}

export default function EmbedBlock({ data, onChange }: EmbedBlockProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">رابط التضمين</label>
        <input
          type="url"
          value={data.url || ''}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="https://example.com/embed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">كود التضمين</label>
        <textarea
          value={data.embedCode || ''}
          onChange={(e) => onChange({ ...data, embedCode: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
          placeholder="<iframe>...</iframe> أو أي كود HTML آخر"
        />
      </div>

      {data.embedCode && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div dangerouslySetInnerHTML={{ __html: data.embedCode }} />
        </div>
      )}
    </div>
  );
}
