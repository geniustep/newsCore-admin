interface TwitterCardPreviewProps {
  title?: string;
  description?: string;
  image?: string;
  cardType?: 'summary' | 'summary_large_image';
}

export default function TwitterCardPreview({
  title,
  description,
  image,
  cardType = 'summary_large_image',
}: TwitterCardPreviewProps) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <h4 className="px-4 py-2 bg-gray-50 border-b border-gray-300 text-sm font-medium">
        معاينة Twitter
      </h4>
      <div className="bg-white p-4">
        {cardType === 'summary_large_image' && image && (
          <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-4">
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
        <div className="space-y-2">
          <div className="text-xs text-gray-500">example.com</div>
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
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
