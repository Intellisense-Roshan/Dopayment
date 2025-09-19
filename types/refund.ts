import { z } from 'zod';
import { type TargetType } from './bnpl';

export const DisputeStatus = {
  OPEN: 'open',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  ESCALATED: 'escalated',
} as const;

export type DisputeStatus = (typeof DisputeStatus)[keyof typeof DisputeStatus];

export interface Refund {
  refundId: string;
  orderId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'completed' | 'failed';
  splitAdjustments: {
    targetType: TargetType;
    targetId: string;
    amount: number;
    fromBalance: boolean;
  }[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Dispute {
  disputeId: string;
  orderId: string;
  transactionId: string;
  raisedBy: {
    type: TargetType;
    id: string;
  };
  status: DisputeStatus;
  reason: string;
  evidence?: {
    documents: string[];
    comments: string[];
  };
  resolution?: {
    outcome: 'accepted' | 'rejected' | 'partial';
    amount?: number;
    reason: string;
    resolvedBy: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DisputeComment {
  commentId: string;
  disputeId: string;
  authorType: TargetType;
  authorId: string;
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface RefundRequest {
  orderId: string;
  amount: number;
  reason: string;
  metadata?: Record<string, unknown>;
}

export interface DisputeRequest {
  orderId: string;
  transactionId: string;
  reason: string;
  evidence?: {
    documents: string[];
    comments: string[];
  };
}

// Zod Schemas
export const RefundSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
  reason: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
});

export const DisputeSchema = z.object({
  orderId: z.string(),
  transactionId: z.string(),
  reason: z.string().min(1),
  evidence: z.object({
    documents: z.array(z.string()),
    comments: z.array(z.string()),
  }).optional(),
});