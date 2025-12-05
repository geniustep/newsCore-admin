import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ComputerDesktopIcon, DeviceTabletIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface ArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    title: string;
    subtitle?: string;
    content: string;
    coverImageUrl?: string;
    author?: { displayName: string };
    createdAt?: string;
  };
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const deviceWidths = {
  desktop: 'max-w-4xl',
  tablet: 'max-w-2xl',
  mobile: 'max-w-sm',
};

export default function ArticlePreviewModal({
  isOpen,
  onClose,
  article,
}: ArticlePreviewModalProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${deviceWidths[device]} transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-4">
                    <Dialog.Title className="text-xl font-bold text-gray-900">
                      معاينة المقال
                    </Dialog.Title>

                    {/* Device Toggle */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setDevice('desktop')}
                        className={`p-2 rounded transition-colors ${
                          device === 'desktop' ? 'bg-white shadow' : 'hover:bg-gray-200'
                        }`}
                        title="سطح المكتب"
                      >
                        <ComputerDesktopIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDevice('tablet')}
                        className={`p-2 rounded transition-colors ${
                          device === 'tablet' ? 'bg-white shadow' : 'hover:bg-gray-200'
                        }`}
                        title="تابلت"
                      >
                        <DeviceTabletIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDevice('mobile')}
                        className={`p-2 rounded transition-colors ${
                          device === 'mobile' ? 'bg-white shadow' : 'hover:bg-gray-200'
                        }`}
                        title="هاتف"
                      >
                        <DevicePhoneMobileIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Preview Content */}
                <div className="p-8 overflow-y-auto max-h-[80vh]">
                  {/* Cover Image */}
                  {article.coverImageUrl && (
                    <img
                      src={article.coverImageUrl}
                      alt={article.title || 'صورة المقال'}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}

                  {/* Article Header */}
                  <article className="prose prose-lg max-w-none" dir="rtl">
                    <h1 className={`font-bold text-gray-900 mb-2 ${
                      device === 'mobile' ? 'text-2xl' : 'text-4xl'
                    }`}>
                      {article.title || 'بدون عنوان'}
                    </h1>

                    {article.subtitle && (
                      <h2 className={`text-gray-600 font-normal mb-4 ${
                        device === 'mobile' ? 'text-lg' : 'text-xl'
                      }`}>
                        {article.subtitle}
                      </h2>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 not-prose">
                      {article.author?.displayName && (
                        <span>بواسطة: {article.author.displayName}</span>
                      )}
                      {article.createdAt && (
                        <span>
                          {new Date(article.createdAt).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className="article-content"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                  </article>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
