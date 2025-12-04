import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

export default function ArticlePreviewModal({
  isOpen,
  onClose,
  article,
}: ArticlePreviewModalProps) {
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <Dialog.Title className="text-xl font-bold text-gray-900">
                    معاينة المقال
                  </Dialog.Title>
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
                      alt={article.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}

                  {/* Article Header */}
                  <article className="prose prose-lg max-w-none" dir="rtl">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {article.title}
                    </h1>

                    {article.subtitle && (
                      <h2 className="text-xl text-gray-600 font-normal mb-4">
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
