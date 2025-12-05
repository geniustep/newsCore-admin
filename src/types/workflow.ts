export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}

export interface WorkflowStep {
  id: string;
  status: ArticleStatus;
  userId: string;
  userName: string;
  comment?: string;
  createdAt: Date;
}

export interface ReviewComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  comment: string;
  lineNumber?: number; // للتعليق على سطر معين
  createdAt: Date;
  replies?: ReviewComment[];
}
