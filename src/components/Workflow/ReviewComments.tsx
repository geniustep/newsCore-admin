import { useState } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ReviewComment } from '../../types/workflow';
import { ChatBubbleLeftRightIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface ReviewCommentsProps {
  comments: ReviewComment[];
  onAddComment: (comment: string, lineNumber?: number) => void;
  onReply: (commentId: string, reply: string) => void;
}

export default function ReviewComments({
  comments,
  onAddComment,
  onReply,
}: ReviewCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleReply = (commentId: string) => {
    if (replyText.trim()) {
      onReply(commentId, replyText.trim());
      setReplyText('');
      setReplyingTo(null);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ChatBubbleLeftRightIcon className="w-5 h-5" />
        تعليقات المراجعة
      </h3>

      {/* Add new comment */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
          placeholder="أضف تعليقاً..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          إضافة تعليق
        </button>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">لا توجد تعليقات</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex gap-3">
                {comment.userAvatar ? (
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="w-10 h-10 text-gray-400" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{comment.userName}</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.createdAt), 'PPp', { locale: ar })}
                    </span>
                  </div>
                  {comment.lineNumber && (
                    <span className="text-xs text-blue-600 mb-1 block">
                      السطر {comment.lineNumber}
                    </span>
                  )}
                  <p className="text-sm text-gray-700 mb-2">{comment.comment}</p>
                  
                  {/* Reply button */}
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {replyingTo === comment.id ? 'إلغاء' : 'رد'}
                  </button>

                  {/* Reply form */}
                  {replyingTo === comment.id && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg"
                        placeholder="اكتب رداً..."
                      />
                      <button
                        onClick={() => handleReply(comment.id)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        إرسال
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 mr-6 space-y-2 border-r-2 border-gray-200 pr-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2">
                          {reply.userAvatar ? (
                            <img
                              src={reply.userAvatar}
                              alt={reply.userName}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <UserCircleIcon className="w-8 h-8 text-gray-400" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-xs">{reply.userName}</span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(reply.createdAt), 'PPp', { locale: ar })}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700">{reply.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
