import { ArticleStatus } from '../../types/workflow';

interface StatusBadgeProps {
  status: ArticleStatus;
}

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

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
