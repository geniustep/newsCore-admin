import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { articlesApi } from '../lib/api';
import StatusBadge from '../components/Workflow/StatusBadge';
import WorkflowTimeline from '../components/Workflow/WorkflowTimeline';
import ReviewComments from '../components/Workflow/ReviewComments';
import AssignReviewer from '../components/Workflow/AssignReviewer';
import { ArticleStatus, WorkflowStep, ReviewComment } from '../types/workflow';

export default function ArticleWorkflow() {
  const { id } = useParams<{ id: string }>();
  const [selectedTab, setSelectedTab] = useState<'timeline' | 'comments' | 'assign'>('timeline');

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesApi.getOne(id!),
    enabled: !!id,
  });

  // Mock data - في التطبيق الحقيقي سيأتي من API
  const workflowSteps: WorkflowStep[] = article?.workflowSteps || [];
  const reviewComments: ReviewComment[] = article?.reviewComments || [];

  const handleAddComment = (comment: string) => {
    // TODO: API call
    console.log('Adding comment:', comment);
  };

  const handleReply = (commentId: string, reply: string) => {
    // TODO: API call
    console.log('Replying to comment:', commentId, reply);
  };

  const handleAssignReviewer = (userId: string) => {
    // TODO: API call
    console.log('Assigning reviewer:', userId);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">جاري التحميل...</div>;
  }

  if (!article) {
    return <div className="text-center py-12 text-gray-500">المقال غير موجود</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
          <p className="text-gray-600 mt-1">إدارة سير العمل والمراجعة</p>
        </div>
        <StatusBadge status={article.status as ArticleStatus} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setSelectedTab('timeline')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            selectedTab === 'timeline'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          سير العمل
        </button>
        <button
          onClick={() => setSelectedTab('comments')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            selectedTab === 'comments'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          التعليقات
        </button>
        <button
          onClick={() => setSelectedTab('assign')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            selectedTab === 'assign'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          تعيين مراجع
        </button>
      </div>

      {/* Tab content */}
      {selectedTab === 'timeline' && (
        <WorkflowTimeline steps={workflowSteps} />
      )}

      {selectedTab === 'comments' && (
        <ReviewComments
          comments={reviewComments}
          onAddComment={handleAddComment}
          onReply={handleReply}
        />
      )}

      {selectedTab === 'assign' && (
        <AssignReviewer
          currentReviewerId={article.reviewerId}
          onAssign={handleAssignReviewer}
        />
      )}
    </div>
  );
}
