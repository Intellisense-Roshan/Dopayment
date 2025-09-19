import { z } from 'zod';

// Enums and Base Types
export const TargetType = {
  SHOPKEEPER: 'shopkeeper',
  MERCHANT: 'merchant',
  FRANCHISE: 'franchise',
  SUPPLIER: 'supplier',
  PLATFORM: 'platform',
} as const;

export const RuleScope = {
  GLOBAL: 'global',
  MERCHANT: 'merchant',
  FRANCHISE: 'franchise',
  STORE: 'store',
} as const;

export const PayoutMode = {
  AUTO: 'auto',
  MANUAL: 'manual',
} as const;

export const AmountType = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const;

export type RuleScope = (typeof RuleScope)[keyof typeof RuleScope];
export type PayoutMode = (typeof PayoutMode)[keyof typeof PayoutMode];
export type AmountType = (typeof AmountType)[keyof typeof AmountType];

export interface SplitTarget {
  targetType: TargetType;
  targetId: string;
  amountType: AmountType;
  value: number;
  applyOrder: number;
}

export type TargetType = (typeof TargetType)[keyof typeof TargetType];

// Complex Types
export interface BNPLTransaction {
  orderId: string;
  createdAt: string;
  merchantId: string;
  splitDetails: {
    totalAmount: number;
    numberOfParts: number;
    partsRemaining: number;
    nextPaymentDate: string;
    nextPaymentAmount: number;
    processingFee: number;
    interestAmount: number;
  };
  status: 'pending' | 'completed' | 'failed' | 'reversed';
}

export interface SplitRule {
  id: string;
  name: string;
  merchantId?: string;
  conditions: {
    minAmount: number;
    maxAmount: number;
    merchantCategories: string[];
  };
  splitConfig: {
    numberOfParts: number;
    interestRate: number;
    processingFee: number;
  };
  isActive: boolean;
}

export interface Wallet {
  walletId: string;
  ownerType: TargetType;
  ownerId: string;
  balanceAvailable: number;
  balancePending: number;
  nextPayoutDate?: string;
  lastPayoutDate?: string;
  lastPayoutAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SettlementPolicy {
  payoutDelayDays: number;
  payoutMode: PayoutMode;
  holdRules?: {
    minAmount?: number;
    maxDaysHold?: number;
  };
}

export interface SplitRule {
  ruleId: string;
  name: string;
  scope: RuleScope;
  scopeId?: string;
  priority: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  splits: SplitTarget[];
  settlementPolicy: SettlementPolicy;
  version: number;
  allowNegative: boolean;
  roundingRule: 'halfUp' | 'bankers';
  residualPolicy: 'merchant' | 'platform';
  createdAt: string;
  updatedAt: string;
}

// BNPL Plan Types
export interface BNPLPlan {
  id: string;
  name: string;
  tenorMonths: number;
  interestRate: number;
  processingFee: number;
  minAmount: number;
  maxAmount: number;
  isActive: boolean;
}

// Cart Types for Preview
export interface CartItem {
  sku: string;
  name: string;
  price: number;
  qty: number;
  category: string;
  tags?: string[];
}

export interface BNPLPreviewRequest {
  merchantId: string;
  storeId: string;
  cart: CartItem[];
  selectedPlan: Pick<BNPLPlan, 'tenorMonths' | 'interestRate' | 'processingFee'>;
}

export interface SplitResult {
  targetType: TargetType;
  targetId: string;
  amount: number;
  scheduledPayout: string;
  status: 'pending' | 'settled' | 'reversed';
}

export interface BNPLPreviewResponse {
  orderAmount: number;
  bnplFees: number;
  netToSplit: number;
  splits: SplitResult[];
}

// Wallet and Transaction Types
export interface Wallet {
  walletId: string;
  ownerType: TargetType;
  ownerId: string;
  balanceAvailable: number;
  balancePending: number;
  nextPayoutDate?: string;
  lastPayoutDate?: string;
  lastPayoutAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BNPLTransaction {
  transactionId: string;
  orderId: string;
  walletId: string;
  type: 'credit' | 'debit' | 'refund' | 'adjustment';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  splitDetails: {
    totalAmount: number;
    numberOfParts: number;
    partsRemaining: number;
    nextPaymentDate: string;
    nextPaymentAmount: number;
    processingFee: number;
    interestAmount: number;
  };
  payments: {
    id: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    paidAt?: string;
  }[];
  scheduledSettlementDate?: string;
  settledAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Validation Schemas
export const SplitTargetSchema = z.object({
  targetType: z.nativeEnum(TargetType),
  targetId: z.string(),
  amountType: z.nativeEnum(AmountType),
  value: z.number().min(0),
  applyOrder: z.number().int().min(0),
  conditions: z.object({
    minOrderValue: z.number().optional(),
    category: z.array(z.string()).optional(),
    skuTags: z.array(z.string()).optional(),
  }).optional(),
});

export const SplitRuleSchema = z.object({
  name: z.string().min(1),
  scope: z.nativeEnum(RuleScope),
  scopeId: z.string().optional(),
  priority: z.number().int().min(0),
  effectiveFrom: z.string(),
  effectiveTo: z.string().optional(),
  isActive: z.boolean(),
  splits: z.array(SplitTargetSchema).min(1),
  settlementPolicy: z.object({
    payoutDelayDays: z.number().int().min(0),
    payoutMode: z.nativeEnum(PayoutMode),
    holdRules: z.object({
      minAmount: z.number().optional(),
      maxDaysHold: z.number().optional(),
    }).optional(),
  }),
  version: z.number().int().min(1),
  allowNegative: z.boolean(),
  roundingRule: z.enum(['halfUp', 'bankers']),
  residualPolicy: z.enum(['merchant', 'platform']),
});