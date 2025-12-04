import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
  PhotoIcon,
  CodeBracketIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  Bars3BottomRightIcon,
  PaintBrushIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';

interface TipTapEditorProps {
  content?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor, onViewChange }: { editor: any; onViewChange: (view: 'visual' | 'html') => void }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('رابط الصورة:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('رابط URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const setColor = () => {
    const color = window.prompt('أدخل كود اللون (مثال: #FF0000):');
    if (color) {
      editor.chain().focus().setColor(color).run();
    }
  };

  const setHighlight = () => {
    const color = window.prompt('أدخل لون التمييز (مثال: #FFFF00):', '#FFFF00');
    if (color) {
      editor.chain().focus().setHighlight({ color }).run();
    }
  };

  return (
    <div className="border-b border-gray-300 bg-gray-50 p-2 rounded-t-lg">
      <div className="flex flex-wrap gap-1">
        {/* View Mode Toggle */}
        <div className="flex gap-1 border-l border-gray-300 pl-2 ml-2">
          <button
            onClick={() => onViewChange('visual')}
            className="px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
            type="button"
            title="محرر مرئي"
          >
            محرر
          </button>
          <button
            onClick={() => onViewChange('html')}
            className="px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
            type="button"
            title="كود HTML"
          >
            <CommandLineIcon className="w-5 h-5 inline ml-1" />
            HTML
          </button>
        </div>

        {/* Text formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('bold') ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="غامق (Ctrl+B)"
        >
          <BoldIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('italic') ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="مائل (Ctrl+I)"
        >
          <ItalicIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('underline') ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="تحته خط (Ctrl+U)"
        >
          <UnderlineIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('strike') ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="يتوسطه خط"
        >
          <span className="text-lg font-bold line-through">S</span>
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Colors */}
        <button
          onClick={setColor}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          type="button"
          title="لون النص"
        >
          <PaintBrushIcon className="w-5 h-5" />
        </button>

        <button
          onClick={setHighlight}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('highlight') ? 'bg-yellow-200' : ''
          }`}
          type="button"
          title="تمييز النص"
        >
          <span className="px-2 py-1 bg-yellow-200 rounded text-sm font-bold">A</span>
        </button>

        <button
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="px-2 py-1 rounded hover:bg-gray-200 transition-colors text-xs"
          type="button"
          title="إزالة التنسيق"
        >
          ✕
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors font-bold ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="عنوان 1"
        >
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors font-bold ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="عنوان 2"
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors font-bold ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="عنوان 3"
        >
          H3
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('bulletList') ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="قائمة نقطية"
        >
          <ListBulletIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('orderedList') ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="قائمة مرقمة"
        >
          <NumberedListIcon className="w-5 h-5" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="محاذاة لليمين"
        >
          <Bars3BottomRightIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="محاذاة للوسط"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="محاذاة لليسار"
        >
          <Bars3BottomLeftIcon className="w-5 h-5" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Code block & Quote */}
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('codeBlock') ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="كود"
        >
          <CodeBracketIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('blockquote') ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="اقتباس"
        >
          "
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Link & Image */}
        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('link') ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="رابط"
        >
          <LinkIcon className="w-5 h-5" />
        </button>

        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          type="button"
          title="صورة"
        >
          <PhotoIcon className="w-5 h-5" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Clear formatting */}
        <button
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm"
          type="button"
          title="مسح التنسيق"
        >
          مسح
        </button>
      </div>
    </div>
  );
};

export default function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
  const [viewMode, setViewMode] = useState<'visual' | 'html'>('visual');
  const [htmlContent, setHtmlContent] = useState(content || '');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 hover:underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'اكتب محتوى المقال هنا...',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  const handleViewChange = (view: 'visual' | 'html') => {
    if (view === 'html' && editor) {
      setHtmlContent(editor.getHTML());
    } else if (view === 'visual' && editor) {
      editor.commands.setContent(htmlContent);
      onChange(htmlContent);
    }
    setViewMode(view);
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setHtmlContent(newHtml);
    onChange(newHtml);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <MenuBar editor={editor} onViewChange={handleViewChange} />

      {viewMode === 'visual' ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          value={htmlContent}
          onChange={handleHtmlChange}
          className="w-full min-h-[400px] p-4 font-mono text-sm focus:outline-none"
          dir="ltr"
          placeholder="<p>اكتب كود HTML هنا...</p>"
        />
      )}
    </div>
  );
}
