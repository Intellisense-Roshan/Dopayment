export type OwnerType = 'customer' | 'shopkeeper' | 'merchant' | 'franchise' | 'supplier' | 'platform';

export type NotificationType =
  | 'order_placed'
  | 'payout_scheduled'
  | 'payout_completed'
  | 'payout_failed'
  | 'refund_initiated'
  | 'refund_completed'
  | 'settlement_summary'
  | 'reconciliation_mismatch';

export interface NotificationPayload {
  type: NotificationType;
  ownerType: OwnerType;
  ownerId: string;
  amount?: number;
  payoutDate?: string;
  reference?: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  types: {
    [key in NotificationType]: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}