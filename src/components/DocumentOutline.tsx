import { useEffect, useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface Heading {
  id: string;
  level: number;
  text: string;
}

interface DocumentOutlineProps {
  content: string;
}

export default function DocumentOutline({ content }: DocumentOutlineProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Parse HTML content to extract headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const extractedHeadings: Heading[] = [];
    headingElements.forEach((heading, index) => {
      const level = parseInt(heading.tagName[1]);
      const text = heading.textContent || '';
      const id = `heading-${index}`;

      extractedHeadings.push({ id, level, text });
    });

    setHeadings(extractedHeadings);
  }, [content]);

  if (headings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <DocumentTextIcon className="w-5 h-5" />
          هيكل المستند
        </h3>
        <p className="text-sm text-gray-500">لا توجد عناوين في المقال</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <DocumentTextIcon className="w-5 h-5" />
        هيكل المستند
      </h3>
      <div className="space-y-1">
        {headings.map((heading) => (
          <div
            key={heading.id}
            className="text-sm hover:bg-gray-50 rounded px-2 py-1 cursor-pointer transition-colors"
            style={{ paddingRight: `${(heading.level - 1) * 12 + 8}px` }}
          >
            <span className="text-gray-600">
              {heading.level === 1 && '⬤ '}
              {heading.level === 2 && '◆ '}
              {heading.level === 3 && '▸ '}
              {heading.text}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>إجمالي العناوين:</span>
          <span className="font-semibold">{headings.length}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span>عدد الكلمات:</span>
          <span className="font-semibold">
            {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}
          </span>
        </div>
      </div>
    </div>
  );
}
