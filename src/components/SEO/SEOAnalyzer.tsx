interface SEOAnalyzerProps {
  title?: string;
  description?: string;
  content?: string;
  keywords?: string[];
}

export default function SEOAnalyzer({
  title,
  description,
  content,
  keywords,
}: SEOAnalyzerProps) {
  const analyze = () => {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Title analysis
    if (!title || title.length === 0) {
      issues.push('❌ العنوان مفقود');
    } else if (title.length < 30) {
      suggestions.push('⚠️ العنوان قصير جداً (أقل من 30 حرف)');
    } else if (title.length > 60) {
      issues.push('❌ العنوان طويل جداً (أكثر من 60 حرف)');
    } else {
      suggestions.push('✅ العنوان في الطول المناسب');
    }

    // Description analysis
    if (!description || description.length === 0) {
      issues.push('❌ الوصف مفقود');
    } else if (description.length < 120) {
      suggestions.push('⚠️ الوصف قصير (يُفضل 120-160 حرف)');
    } else if (description.length > 160) {
      issues.push('❌ الوصف طويل جداً (أكثر من 160 حرف)');
    } else {
      suggestions.push('✅ الوصف في الطول المناسب');
    }

    // Keywords analysis
    if (!keywords || keywords.length === 0) {
      suggestions.push('⚠️ لا توجد كلمات مفتاحية');
    } else if (keywords.length < 3) {
      suggestions.push('⚠️ يُفضل إضافة 3-5 كلمات مفتاحية على الأقل');
    } else if (keywords.length > 10) {
      suggestions.push('⚠️ عدد كبير من الكلمات المفتاحية (يُفضل 3-10)');
    } else {
      suggestions.push('✅ عدد الكلمات المفتاحية مناسب');
    }

    // Content analysis
    if (!content || content.length < 300) {
      suggestions.push('⚠️ المحتوى قصير (يُفضل أكثر من 300 كلمة)');
    } else {
      suggestions.push('✅ المحتوى في الطول المناسب');
    }

    return { issues, suggestions };
  };

  const { issues, suggestions } = analyze();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">تحليل SEO</h3>

      {issues.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-red-600 mb-2">مشاكل يجب إصلاحها:</h4>
          <ul className="space-y-1">
            {issues.map((issue, index) => (
              <li key={index} className="text-sm text-red-600">
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">اقتراحات وتحسينات:</h4>
        <ul className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="text-sm text-gray-600">
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
