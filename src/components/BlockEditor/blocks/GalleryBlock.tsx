import { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface GalleryBlockProps {
  data: { images?: Array<{ url: string; alt?: string }> };
  onChange: (data: any) => void;
}

export default function GalleryBlock({ data, onChange }: GalleryBlockProps) {
  const images = data.images || [];

  const handleAddImage = () => {
    // TODO: Open media library
    const newImage = { url: '', alt: '' };
    onChange({ ...data, images: [...images, newImage] });
  };

  const handleRemoveImage = (index: number) => {
    onChange({ ...data, images: images.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            {image.url ? (
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <PhotoIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 left-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={handleAddImage}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
        >
          <PhotoIcon className="w-8 h-8 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
