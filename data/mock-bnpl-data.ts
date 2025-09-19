import type { BNPLTransaction, SplitRule, Wallet, TargetType } from '../types/bnpl';

export const mockTransactions: BNPLTransaction[] = [
  {
    orderId: 'order_1',
    merchantId: 'merchant_1',
    createdAt: '2025-09-01T10:00:00Z',
    status: 'pending',
    splitDetails: {
      totalAmount: 15000,
      numberOfParts: 3,
      partsRemaining: 2,
      nextPaymentDate: '2025-10-01T00:00:00Z',
      nextPaymentAmount: 5000,
      processingFee: 99,
      interestAmount: 450
    }
  },
  {
    orderId: 'order_2',
    merchantId: 'merchant_2',
    createdAt: '2025-08-15T15:30:00Z',
    status: 'completed',
    splitDetails: {
      totalAmount: 30000,
      numberOfParts: 6,
      partsRemaining: 0,
      nextPaymentDate: '2025-09-15T00:00:00Z',
      nextPaymentAmount: 5000,
      processingFee: 149,
      interestAmount: 1350
    }
  }
];

export const mockRules: SplitRule[] = [
  {
    id: 'rule_1',
    name: 'Standard Split',
    conditions: {
      minAmount: 5000,
      maxAmount: 50000,
      merchantCategories: ['retail', 'electronics']
    },
    splitConfig: {
      numberOfParts: 3,
      interestRate: 0,
      processingFee: 99
    },
    isActive: true
  },
  {
    id: 'rule_2',
    name: 'Premium Split',
    conditions: {
      minAmount: 50000,
      maxAmount: 200000,
      merchantCategories: ['electronics', 'furniture']
    },
    splitConfig: {
      numberOfParts: 6,
      interestRate: 1.5,
      processingFee: 149
    },
    isActive: true
  }
];

export const mockWallets: { [key: string]: Wallet } = {
  merchant: {
    walletId: 'w_merchant',
    ownerType: 'MERCHANT' as TargetType,
    ownerId: 'm_123',
    balanceAvailable: 50000,
    balancePending: 25000,
    nextPayoutDate: '2025-09-20',
    lastPayoutDate: '2025-09-13',
    lastPayoutAmount: 45000,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-09-13T12:00:00Z'
  },
  shopkeeper: {
    walletId: 'w_shopkeeper',
    ownerType: 'SHOPKEEPER' as TargetType,
    ownerId: 's_456',
    balanceAvailable: 15000,
    balancePending: 7500,
    nextPayoutDate: '2025-09-15',
    lastPayoutDate: '2025-09-08',
    lastPayoutAmount: 12000,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-09-13T12:00:00Z'
  }
};