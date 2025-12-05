import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ImageBlockProps {
  data: { url?: string; alt?: string; caption?: string };
  onChange: (data: any) => void;
}

export default function ImageBlock({ data, onChange }: ImageBlockProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // TODO: Upload to media API
    // For now, just use a placeholder
    setTimeout(() => {
      onChange({ ...data, url: URL.createObjectURL(file) });
      setUploading(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      {data.url ? (
        <div>
          <img
            src={data.url}
            alt={data.alt}
            className="w-full rounded-lg"
          />
          <button
            onClick={() => onChange({ ...data, url: undefined })}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            إزالة الصورة
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
          <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">انقر لرفع صورة</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">النص البديل</label>
        <input
          type="text"
          value={data.alt || ''}
          onChange={(e) => onChange({ ...data, alt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="وصف الصورة"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">التعليق</label>
        <input
          type="text"
          value={data.caption || ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="تعليق على الصورة"
        />
      </div>
    </div>
  );
}
