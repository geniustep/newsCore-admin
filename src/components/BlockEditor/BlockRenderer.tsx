import { Block } from './BlockEditor';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import GalleryBlock from './blocks/GalleryBlock';
import VideoBlock from './blocks/VideoBlock';
import QuoteBlock from './blocks/QuoteBlock';
import CodeBlock from './blocks/CodeBlock';
import EmbedBlock from './blocks/EmbedBlock';
import TableBlock from './blocks/TableBlock';
import {
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function BlockRenderer({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: BlockRendererProps) {
  const renderBlock = () => {
    switch (block.type) {
      case 'text':
        return <TextBlock data={block.data} onChange={onUpdate} />;
      case 'image':
        return <ImageBlock data={block.data} onChange={onUpdate} />;
      case 'gallery':
        return <GalleryBlock data={block.data} onChange={onUpdate} />;
      case 'video':
        return <VideoBlock data={block.data} onChange={onUpdate} />;
      case 'quote':
        return <QuoteBlock data={block.data} onChange={onUpdate} />;
      case 'code':
        return <CodeBlock data={block.data} onChange={onUpdate} />;
      case 'embed':
        return <EmbedBlock data={block.data} onChange={onUpdate} />;
      case 'table':
        return <TableBlock data={block.data} onChange={onUpdate} />;
      default:
        return <div>نوع بلوك غير معروف</div>;
    }
  };

  return (
    <div
      className={`relative border-2 rounded-lg transition-all ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Block controls */}
      {isSelected && (
        <div className="absolute -top-10 left-0 flex items-center gap-1 bg-gray-800 text-white px-2 py-1 rounded-t-lg text-xs z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className="p-1 hover:bg-gray-700 rounded"
            title="نقل لأعلى"
          >
            <ChevronUpIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className="p-1 hover:bg-gray-700 rounded"
            title="نقل لأسفل"
          >
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('هل أنت متأكد من حذف هذا البلوك؟')) {
                onDelete();
              }
            }}
            className="p-1 hover:bg-red-600 rounded"
            title="حذف"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Block content */}
      <div className="p-4">{renderBlock()}</div>
    </div>
  );
}
