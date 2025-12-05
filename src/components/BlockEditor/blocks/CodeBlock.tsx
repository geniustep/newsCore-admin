interface CodeBlockProps {
  data: { code?: string; language?: string };
  onChange: (data: any) => void;
}

export default function CodeBlock({ data, onChange }: CodeBlockProps) {
  const languages = [
    'javascript',
    'typescript',
    'python',
    'java',
    'html',
    'css',
    'json',
    'bash',
    'sql',
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">اللغة</label>
        <select
          value={data.language || 'javascript'}
          onChange={(e) => onChange({ ...data, language: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">الكود</label>
        <textarea
          value={data.code || ''}
          onChange={(e) => onChange({ ...data, code: e.target.value })}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
          placeholder="اكتب الكود هنا..."
        />
      </div>

      {data.code && (
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm">
            <code>{data.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
