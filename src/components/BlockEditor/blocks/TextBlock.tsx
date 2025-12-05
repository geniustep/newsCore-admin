interface TextBlockProps {
  data: { content?: string };
  onChange: (data: any) => void;
}

export default function TextBlock({ data, onChange }: TextBlockProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">المحتوى</label>
      <textarea
        value={data.content || ''}
        onChange={(e) => onChange({ ...data, content: e.target.value })}
        rows={6}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="اكتب المحتوى هنا..."
      />
    </div>
  );
}
