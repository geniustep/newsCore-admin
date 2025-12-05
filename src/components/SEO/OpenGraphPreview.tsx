interface OpenGraphPreviewProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function OpenGraphPreview({
  title,
  description,
  image,
}: OpenGraphPreviewProps) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <h4 className="px-4 py-2 bg-gray-50 border-b border-gray-300 text-sm font-medium">
        معاينة Facebook
      </h4>
      <div className="bg-white">
        {image && (
          <div className="w-full h-64 bg-gray-200 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-1">example.com</div>
          <h3 className="text-lg font-semibold text-blue-600 mb-1 line-clamp-2">
            {title || 'عنوان المقال'}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {description || 'وصف المقال يظهر هنا...'}
          </p>
        </div>
      </div>
    </div>
  );
}
