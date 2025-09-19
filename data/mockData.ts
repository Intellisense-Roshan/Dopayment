import { 
  Transaction, 
  WalletBalance, 
  MerchantData, 
  SpendingInsight, 
  Reward, 
  User, 
  BankAccount, 
  UPIAccount,
  WalletAccount,
  QRCode, 
  SplitPayment, 
  Dispute, 
  Notification, 
  SecuritySettings, 
  FamilyAccount 
} from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Arjun Kumar',
  email: 'arjun@example.com',
  phone: '+91 98765 43210',
  kycStatus: 'light',
  accountType: 'personal',
};

export const mockWalletBalance: WalletBalance = {
  wallet: 12450.75,
  bank: 8920.50,
  total: 21371.25,
};

export const mockMerchantData: MerchantData = {
  todayEarnings: 3250.00,
  pendingSettlements: 12800.00,
  totalTransactions: 47,
  settlementSchedule: 'T+1',
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 450.00,
    type: 'sent',
    status: 'completed',
    description: 'Lunch at Cafe Mocha',
    timestamp: new Date('2025-01-20T14:30:00'),
    recipientName: 'Cafe Mocha',
    category: 'Food & Dining',
    paymentMode: 'upi',
  },
  {
    id: '2',
    amount: 1200.00,
    type: 'received',
    status: 'completed',
    description: 'Payment from client',
    timestamp: new Date('2025-01-20T11:15:00'),
    senderName: 'Tech Solutions Inc.',
    category: 'Business',
    paymentMode: 'bank',
  },
  {
    id: '3',
    amount: 75.50,
    type: 'payment',
    status: 'completed',
    description: 'Metro recharge',
    timestamp: new Date('2025-01-19T18:45:00'),
    recipientName: 'Delhi Metro',
    category: 'Transportation',
    paymentMode: 'wallet',
  },
  {
    id: '4',
    amount: 250.00,
    type: 'request',
    status: 'pending',
    description: 'Movie tickets split',
    timestamp: new Date('2025-01-19T16:20:00'),
    recipientName: 'Priya Sharma',
    category: 'Entertainment',
    paymentMode: 'wallet',
  },
  {
    id: '5',
    amount: 850.00,
    type: 'sent',
    status: 'failed',
    description: 'Online shopping',
    timestamp: new Date('2025-01-18T20:10:00'),
    recipientName: 'Amazon Pay',
    category: 'Shopping',
    paymentMode: 'upi',
  },
];

export const mockSpendingInsights: SpendingInsight[] = [
  { category: 'Food & Dining', amount: 2450, percentage: 35, transactions: 12 },
  { category: 'Shopping', amount: 1800, percentage: 25, transactions: 8 },
  { category: 'Transportation', amount: 980, percentage: 14, transactions: 15 },
  { category: 'Entertainment', amount: 720, percentage: 10, transactions: 5 },
  { category: 'Bills & Utilities', amount: 650, percentage: 9, transactions: 4 },
  { category: 'Others', amount: 500, percentage: 7, transactions: 6 },
];

export const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'First Payment',
    description: 'Made your first payment',
    points: 50,
    achieved: true,
    icon: 'trophy',
  },
  {
    id: '2',
    title: 'Budget Saver',
    description: 'Stayed under budget for 7 days',
    points: 100,
    achieved: true,
    icon: 'piggy-bank',
  },
  {
    id: '3',
    title: 'QR Master',
    description: 'Made 10 QR payments',
    points: 75,
    achieved: false,
    icon: 'qr-code',
  },
  {
    id: '4',
    title: 'Split Champion',
    description: 'Used split payments 5 times',
    points: 125,
    achieved: false,
    icon: 'users',
  },
];

export const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    bankName: 'HDFC Bank',
    accountNumber: '****1234',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Arjun Kumar',
    isPrimary: true,
    isVerified: true,
  },
  {
    id: '2',
    bankName: 'ICICI Bank',
    accountNumber: '****5678',
    ifscCode: 'ICIC0005678',
    accountHolderName: 'Arjun Kumar',
    isPrimary: false,
    isVerified: true,
  },
];

export const mockWalletAccounts: WalletAccount[] = [
  {
    id: '1',
    provider: 'PayPal',
    email: 'arjun@example.com',
    balance: 2450.75,
    currency: 'USD',
    isVerified: true,
    isPrimary: true,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png'
  },
  {
    id: '2',
    provider: 'Google Pay',
    email: 'arjun@example.com',
    balance: 1850.00,
    currency: 'INR',
    isVerified: true,
    isPrimary: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Google_Pay_Logo.png'
  }
];

export const mockUPIAccounts: UPIAccount[] = [
  {
    id: '1',
    upiId: 'arjun@ybl',
    bankName: 'HDFC Bank',
    isVerified: true,
    isPrimary: true,
  }
];

export const mockQRCodes: QRCode[] = [
  {
    id: '1',
    upiId: 'arjun@paytm',
    amount: undefined,
    description: 'Personal QR Code',
    merchantName: undefined,
    isActive: true,
    createdAt: new Date('2025-01-15T10:00:00'),
  },
  {
    id: '2',
    upiId: 'arjun@paytm',
    amount: 500,
    description: 'Lunch payment',
    merchantName: 'Cafe Mocha',
    isActive: true,
    createdAt: new Date('2025-01-20T12:00:00'),
  },
];

export const mockSplitPayments: SplitPayment[] = [
  {
    id: '1',
    totalAmount: 1200,
    participants: [
      { userId: '1', name: 'Arjun Kumar', amount: 300, status: 'paid', phone: '+91 98765 43210' },
      { userId: '2', name: 'Priya Sharma', amount: 300, status: 'paid', phone: '+91 98765 43211' },
      { userId: '3', name: 'Rahul Singh', amount: 300, status: 'pending', phone: '+91 98765 43212' },
      { userId: '4', name: 'Sneha Patel', amount: 300, status: 'pending', phone: '+91 98765 43213' },
    ],
    description: 'Dinner at Restaurant',
    status: 'pending',
    createdAt: new Date('2025-01-20T19:30:00'),
  },
];

export const mockDisputes: Dispute[] = [
  {
    id: '1',
    transactionId: '5',
    reason: 'Transaction failed but amount deducted',
    description: 'The payment to Amazon Pay failed but the amount was deducted from my account. Please investigate and refund.',
    status: 'open',
    createdAt: new Date('2025-01-18T20:30:00'),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Payment Received',
    message: 'You received ₹1,200 from Tech Solutions Inc.',
    type: 'success',
    isRead: false,
    createdAt: new Date('2025-01-20T11:15:00'),
    actionUrl: '/transactions/2',
  },
  {
    id: '2',
    title: 'KYC Reminder',
    message: 'Complete your KYC to unlock higher transaction limits',
    type: 'warning',
    isRead: false,
    createdAt: new Date('2025-01-19T09:00:00'),
    actionUrl: '/kyc',
  },
  {
    id: '3',
    title: 'Security Alert',
    message: 'New login detected from a different device',
    type: 'error',
    isRead: true,
    createdAt: new Date('2025-01-18T14:30:00'),
  },
];

export const mockSecuritySettings: SecuritySettings = {
  appLock: true,
  biometricEnabled: false,
  twoFactorEnabled: true,
  fraudAlerts: true,
  transactionAlerts: true,
  spendingAlerts: true,
};

export const mockFamilyAccounts: FamilyAccount[] = [
  {
    id: '1',
    parentId: '1',
    childId: '2',
    spendingLimit: 1000,
    permissions: {
      canSendMoney: true,
      canReceiveMoney: true,
      canUseQR: false,
      canViewTransactions: true,
    },
    createdAt: new Date('2025-01-10T10:00:00'),
  },
];