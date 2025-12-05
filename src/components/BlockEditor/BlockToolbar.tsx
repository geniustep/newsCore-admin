import {
  DocumentTextIcon,
  PhotoIcon,
  RectangleStackIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  LinkIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import { Block } from './BlockEditor';

interface BlockToolbarProps {
  onAddBlock: (type: Block['type']) => void;
}

const blockTypes: Array<{ type: Block['type']; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { type: 'text', label: 'نص', icon: DocumentTextIcon },
  { type: 'image', label: 'صورة', icon: PhotoIcon },
  { type: 'gallery', label: 'معرض صور', icon: RectangleStackIcon },
  { type: 'video', label: 'فيديو', icon: VideoCameraIcon },
  { type: 'quote', label: 'اقتباس', icon: ChatBubbleLeftRightIcon },
  { type: 'code', label: 'كود', icon: CodeBracketIcon },
  { type: 'embed', label: 'تضمين', icon: LinkIcon },
  { type: 'table', label: 'جدول', icon: TableCellsIcon },
];

export default function BlockToolbar({ onAddBlock }: BlockToolbarProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">إضافة بلوك</h3>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {blockTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onAddBlock(type)}
            className="flex flex-col items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-colors"
            title={label}
          >
            <Icon className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
