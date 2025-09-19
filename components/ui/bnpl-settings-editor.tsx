import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from './card';
import { Input } from './input';
import { Label } from './label';
import { Select } from './select';
import { Switch } from './switch';
import { Button } from './button';

const bnplSettingsSchema = z.object({
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

type BNPLSettings = z.infer<typeof bnplSettingsSchema>;

interface BNPLSettingsEditorProps {
  settings: BNPLSettings;
  onSave: (settings: BNPLSettings) => Promise<void>;
}

export const BNPLSettingsEditor: React.FC<BNPLSettingsEditorProps> = ({
  settings,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<BNPLSettings>({
    resolver: zodResolver(bnplSettingsSchema),
    defaultValues: settings,
  });

  const onSubmit = async (data: BNPLSettings) => {
    try {
      await onSave(data);
      reset(data);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Platform Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Default Fee Percentage</Label>
            <Input
              type="number"
              step="0.01"
              {...register('platform.defaultFeePercentage', {
                valueAsNumber: true,
              })}
              className={errors.platform?.defaultFeePercentage ? "border-red-500" : ""}
              title={errors.platform?.defaultFeePercentage?.message}
            />
          </div>
          <div className="space-y-2">
            <Label>Processing Fee</Label>
            <Input
              type="number"
              step="0.01"
              {...register('platform.defaultProcessingFee', {
                valueAsNumber: true,
              })}
              className={errors.platform?.defaultProcessingFee ? "border-red-500" : ""}
              title={errors.platform?.defaultProcessingFee?.message}
            />
          </div>
          <div className="space-y-2">
            <Label>Min Transaction Amount</Label>
            <Input
              type="number"
              {...register('platform.minTransactionAmount', {
                valueAsNumber: true,
              })}
              className={errors.platform?.minTransactionAmount ? "border-red-500" : ""}
              title={errors.platform?.minTransactionAmount?.message}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Transaction Amount</Label>
            <Input
              type="number"
              {...register('platform.maxTransactionAmount', {
                valueAsNumber: true,
              })}
              className={errors.platform?.maxTransactionAmount ? "border-red-500" : ""}
              title={errors.platform?.maxTransactionAmount?.message}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Settlement Settings</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Payout Delay (Days)</Label>
              <Input
                type="number"
                {...register('settlement.defaultPayoutDelay', {
                  valueAsNumber: true,
                })}
                className={errors.settlement?.defaultPayoutDelay ? "border-red-500" : ""}
                title={errors.settlement?.defaultPayoutDelay?.message}
              />
            </div>
            <div className="space-y-2">
              <Label>Rounding Rule</Label>
              <Select {...register('settlement.defaultRoundingRule')}>
                <option value="halfUp">Half Up</option>
                <option value="bankers">Bankers</option>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Allow Instant Payout</Label>
            <Switch
              {...register('settlement.allowInstantPayout')}
              checked={watch('settlement.allowInstantPayout')}
            />
          </div>

          {watch('settlement.allowInstantPayout') && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Instant Payout</Label>
                <Input
                  type="number"
                  {...register('settlement.minInstantPayoutAmount', {
                    valueAsNumber: true,
                  })}
                  className={errors.settlement?.minInstantPayoutAmount ? "border-red-500" : ""}
                  title={errors.settlement?.minInstantPayoutAmount?.message}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Instant Payout</Label>
                <Input
                  type="number"
                  {...register('settlement.maxInstantPayoutAmount', {
                    valueAsNumber: true,
                  })}
                  className={errors.settlement?.maxInstantPayoutAmount ? "border-red-500" : ""}
                  title={errors.settlement?.maxInstantPayoutAmount?.message}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Risk Management</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Require Bank Verification</Label>
            <Switch
              {...register('risk.requireBankVerification')}
              checked={watch('risk.requireBankVerification')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Allow Negative Balance</Label>
            <Switch
              {...register('risk.allowNegativeBalance')}
              checked={watch('risk.allowNegativeBalance')}
            />
          </div>

          {watch('risk.allowNegativeBalance') && (
            <div className="space-y-2">
              <Label>Max Negative Balance</Label>
              <Input
                type="number"
                {...register('risk.maxNegativeBalanceAmount', {
                  valueAsNumber: true,
                })}
                className={errors.risk?.maxNegativeBalanceAmount ? "border-red-500" : ""}
                title={errors.risk?.maxNegativeBalanceAmount?.message}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label>Auto Reconciliation</Label>
            <Switch
              {...register('risk.autoReconciliationEnabled')}
              checked={watch('risk.autoReconciliationEnabled')}
            />
          </div>

          {watch('risk.autoReconciliationEnabled') && (
            <div className="space-y-2">
              <Label>Reconciliation Threshold (₹)</Label>
              <Input
                type="number"
                {...register('risk.reconciliationThreshold', {
                  valueAsNumber: true,
                })}
                className={errors.risk?.reconciliationThreshold ? "border-red-500" : ""}
                title={errors.risk?.reconciliationThreshold?.message}
              />
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label>Email Notifications</Label>
              <Switch
                {...register('notifications.enableEmailNotifications')}
                checked={watch('notifications.enableEmailNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>SMS Notifications</Label>
              <Switch
                {...register('notifications.enableSmsNotifications')}
                checked={watch('notifications.enableSmsNotifications')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label>Push Notifications</Label>
              <Switch
                {...register('notifications.enablePushNotifications')}
                checked={watch('notifications.enablePushNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Daily Summary</Label>
              <Switch
                {...register('notifications.dailySummaryEnabled')}
                checked={watch('notifications.dailySummaryEnabled')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Critical Alert Threshold (₹)</Label>
            <Input
              type="number"
              {...register('notifications.criticalAlertThreshold', {
                valueAsNumber: true,
              })}
              className={errors.notifications?.criticalAlertThreshold ? "border-red-500" : ""}
              title={errors.notifications?.criticalAlertThreshold?.message}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => reset(settings)}>
          Reset
        </Button>
        <Button type="submit" disabled={!isDirty}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};