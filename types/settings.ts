import { z } from 'zod';

export interface BNPLSettings {
  platform: {
    defaultFeePercentage: number;
    defaultProcessingFee: number;
    minTransactionAmount: number;
    maxTransactionAmount: number;
    defaultTenorMonths: number;
    interestRateSettings: {
      baseRate: number;
      maxRate: number;
    };
  };
  settlement: {
    defaultPayoutDelay: number;
    allowInstantPayout: boolean;
    minInstantPayoutAmount: number;
    maxInstantPayoutAmount: number;
    defaultRoundingRule: 'halfUp' | 'bankers';
    defaultResidualPolicy: 'merchant' | 'platform';
  };
  risk: {
    requireBankVerification: boolean;
    allowNegativeBalance: boolean;
    maxNegativeBalanceAmount: number;
    autoReconciliationEnabled: boolean;
    reconciliationThreshold: number;
  };
  notifications: {
    enableEmailNotifications: boolean;
    enableSmsNotifications: boolean;
    enablePushNotifications: boolean;
    dailySummaryEnabled: boolean;
    criticalAlertThreshold: number;
  };
}

export const BNPLSettingsSchema = z.object({
  platform: z.object({
    defaultFeePercentage: z.number().min(0).max(100),
    defaultProcessingFee: z.number().min(0),
    minTransactionAmount: z.number().min(0),
    maxTransactionAmount: z.number().min(0),
    defaultTenorMonths: z.number().int().min(1),
    interestRateSettings: z.object({
      baseRate: z.number().min(0),
      maxRate: z.number().min(0),
    }),
  }),
  settlement: z.object({
    defaultPayoutDelay: z.number().int().min(0),
    allowInstantPayout: z.boolean(),
    minInstantPayoutAmount: z.number().min(0),
    maxInstantPayoutAmount: z.number().min(0),
    defaultRoundingRule: z.enum(['halfUp', 'bankers']),
    defaultResidualPolicy: z.enum(['merchant', 'platform']),
  }),
  risk: z.object({
    requireBankVerification: z.boolean(),
    allowNegativeBalance: z.boolean(),
    maxNegativeBalanceAmount: z.number().min(0),
    autoReconciliationEnabled: z.boolean(),
    reconciliationThreshold: z.number().min(0),
  }),
  notifications: z.object({
    enableEmailNotifications: z.boolean(),
    enableSmsNotifications: z.boolean(),
    enablePushNotifications: z.boolean(),
    dailySummaryEnabled: z.boolean(),
    criticalAlertThreshold: z.number().min(0),
  }),
});