import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { WorkflowStep, ArticleStatus } from '../../types/workflow';

const statusConfig = {
  [ArticleStatus.DRAFT]: {
    label: 'مسودة',
    color: 'gray',
    icon: '📝',
  },
  [ArticleStatus.PENDING_REVIEW]: {
    label: 'بانتظار المراجعة',
    color: 'yellow',
    icon: '⏳',
  },
  [ArticleStatus.IN_REVIEW]: {
    label: 'قيد المراجعة',
    color: 'blue',
    icon: '👀',
  },
  [ArticleStatus.APPROVED]: {
    label: 'مُعتمد',
    color: 'green',
    icon: '✅',
  },
  [ArticleStatus.PUBLISHED]: {
    label: 'منشور',
    color: 'green',
    icon: '🚀',
  },
  [ArticleStatus.REJECTED]: {
    label: 'مرفوض',
    color: 'red',
    icon: '❌',
  },
  [ArticleStatus.ARCHIVED]: {
    label: 'مؤرشف',
    color: 'gray',
    icon: '📦',
  },
};

interface WorkflowTimelineProps {
  steps: WorkflowStep[];
}

export default function WorkflowTimeline({ steps }: WorkflowTimelineProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">سير العمل</h3>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const config = statusConfig[step.status];
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    config.color === 'gray' ? 'bg-gray-100' :
                    config.color === 'yellow' ? 'bg-yellow-100' :
                    config.color === 'blue' ? 'bg-blue-100' :
                    config.color === 'green' ? 'bg-green-100' :
                    'bg-red-100'
                  }`}
                >
                  {config.icon}
                </div>
                {!isLast && (
                  <div className="w-0.5 h-full bg-gray-200 my-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{config.label}</span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(step.createdAt), 'PPp', { locale: ar })}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  بواسطة: {step.userName}
                </p>
                {step.comment && (
                  <div className="mt-2 bg-gray-50 rounded p-3 text-sm">
                    {step.comment}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
