import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
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
} from '@heroicons/react/24/outline';

interface TipTapEditorProps {
  content?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
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

  return (
    <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1 rounded-t-lg">
      {/* Text formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bold') ? 'bg-gray-300' : ''
        }`}
        type="button"
        title="غامق"
      >
        <BoldIcon className="w-5 h-5" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('italic') ? 'bg-gray-300' : ''
        }`}
        type="button"
        title="مائل"
      >
        <ItalicIcon className="w-5 h-5" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('underline') ? 'bg-gray-300' : ''
        }`}
        type="button"
        title="تحته خط"
      >
        <UnderlineIcon className="w-5 h-5" />
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
    </div>
  );
};

export default function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
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
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
