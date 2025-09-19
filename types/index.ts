export * from './WalletAccount';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  kycStatus: 'pending' | 'light' | 'full';
  accountType: 'personal' | 'merchant' | 'family-parent' | 'family-child';
  parentId?: string;
  dateOfBirth?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  gstNumber?: string;
  spendingLimit?: number;
  isParent?: boolean;
  children?: string[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  isPrimary: boolean;
  isVerified: boolean;
}

export interface UPIAccount {
  id: string;
  upiId: string;
  bankName: string;
  isPrimary: boolean;
  isVerified: boolean;
}

export interface QRCode {
  id: string;
  upiId: string;
  amount?: number;
  description?: string;
  merchantName?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface SplitPayment {
  id: string;
  totalAmount: number;
  participants: SplitParticipant[];
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  settledAt?: Date;
}

export interface SplitParticipant {
  userId: string;
  name: string;
  amount: number;
  status: 'pending' | 'paid' | 'received';
  phone?: string;
  email?: string;
}

export interface Dispute {
  id: string;
  transactionId: string;
  reason: string;
  description: string;
  status: 'open' | 'in-review' | 'resolved' | 'rejected';
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface SecuritySettings {
  appLock: boolean;
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  fraudAlerts: boolean;
  transactionAlerts: boolean;
  spendingAlerts: boolean;
}

export interface FamilyAccount {
  id: string;
  parentId: string;
  childId: string;
  spendingLimit: number;
  permissions: {
    canSendMoney: boolean;
    canReceiveMoney: boolean;
    canUseQR: boolean;
    canViewTransactions: boolean;
  };
  createdAt: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'sent' | 'received' | 'payment' | 'request';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  timestamp: Date;
  recipientName?: string;
  senderName?: string;
  category: string;
  paymentMode: 'upi' | 'wallet' | 'qr' | 'bank';
}

export interface WalletBalance {
  wallet: number;
  bank: number;
  total: number;
}

export interface MerchantData {
  todayEarnings: number;
  pendingSettlements: number;
  totalTransactions: number;
  settlementSchedule: 'T+0' | 'T+1' | 'T+7';
}

export interface SpendingInsight {
  category: string;
  amount: number;
  percentage: number;
  transactions: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  achieved: boolean;
  icon: string;
}