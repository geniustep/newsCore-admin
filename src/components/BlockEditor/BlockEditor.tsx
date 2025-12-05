import { useState, useCallback } from 'react';
import BlockRenderer from './BlockRenderer';
import BlockToolbar from './BlockToolbar';

// Simple ID generator (can be replaced with nanoid later)
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export interface Block {
  id: string;
  type: 'text' | 'image' | 'gallery' | 'video' | 'quote' | 'code' | 'embed' | 'table';
  data: any;
  order: number;
}

interface BlockEditorProps {
  initialBlocks?: Block[];
  onChange: (blocks: Block[]) => void;
}

export default function BlockEditor({ initialBlocks = [], onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = useCallback((type: Block['type']) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      data: {},
      order: blocks.length,
    };
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    onChange(updatedBlocks);
    setSelectedBlockId(newBlock.id);
  }, [blocks, onChange]);

  const updateBlock = useCallback((id: string, data: any) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, data } : block
    );
    setBlocks(updatedBlocks);
    onChange(updatedBlocks);
  }, [blocks, onChange]);

  const deleteBlock = useCallback((id: string) => {
    const updatedBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(updatedBlocks);
    onChange(updatedBlocks);
  }, [blocks, onChange]);

  const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const updatedBlocks = [...blocks];
    [updatedBlocks[index], updatedBlocks[newIndex]] = [updatedBlocks[newIndex], updatedBlocks[index]];
    const reorderedBlocks = updatedBlocks.map((block, idx) => ({ ...block, order: idx }));
    setBlocks(reorderedBlocks);
    onChange(reorderedBlocks);
  }, [blocks, onChange]);

  return (
    <div className="space-y-4">
      <BlockToolbar onAddBlock={addBlock} />

      <div className="space-y-4">
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            isSelected={selectedBlockId === block.id}
            onSelect={() => setSelectedBlockId(block.id)}
            onUpdate={(data) => updateBlock(block.id, data)}
            onDelete={() => deleteBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, 'up')}
            onMoveDown={() => moveBlock(block.id, 'down')}
          />
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="mb-4">ابدأ بإضافة بلوك من القائمة أعلاه</p>
        </div>
      )}
    </div>
  );
}
