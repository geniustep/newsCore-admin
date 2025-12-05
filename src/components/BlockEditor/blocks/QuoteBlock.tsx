interface QuoteBlockProps {
  data: { text?: string; author?: string; source?: string };
  onChange: (data: any) => void;
}

export default function QuoteBlock({ data, onChange }: QuoteBlockProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">النص</label>
        <textarea
          value={data.text || ''}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="نص الاقتباس..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">المؤلف</label>
        <input
          type="text"
          value={data.author || ''}
          onChange={(e) => onChange({ ...data, author: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="اسم المؤلف"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">المصدر</label>
        <input
          type="text"
          value={data.source || ''}
          onChange={(e) => onChange({ ...data, source: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="المصدر (اختياري)"
        />
      </div>

      {data.text && (
        <div className="border-r-4 border-blue-500 pr-4 py-2 bg-gray-50 rounded">
          <p className="text-lg italic text-gray-700">"{data.text}"</p>
          {data.author && (
            <p className="text-sm text-gray-600 mt-2">— {data.author}</p>
          )}
        </div>
      )}
    </div>
  );
}
