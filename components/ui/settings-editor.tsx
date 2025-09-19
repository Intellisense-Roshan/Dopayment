import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { BNPLSettings } from '../types/settings';
import { BNPLSettingsSchema } from '../types/settings';
import { Card } from './card';
import { Input } from './input';
import { Label } from './label';
import { Select } from './select';
import { Switch } from './switch';
import { Button } from './button';
import { Separator } from './separator';

interface SettingsEditorProps {
  settings: BNPLSettings;
  onSave: (settings: BNPLSettings) => Promise<void>;
}

export const SettingsEditor: React.FC<SettingsEditorProps> = ({
  settings,
  onSave,
}) => {
  const form = useForm<BNPLSettings>({
    resolver: zodResolver(BNPLSettingsSchema),
    defaultValues: settings,
  });

  const handleSubmit = async (data: BNPLSettings) => {
    try {
      await onSave(data);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">General Settings</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="roundingRule">Rounding Rule</Label>
            <Select id="roundingRule" {...form.register('roundingRule')}>
              <option value="halfUp">Half Up</option>
              <option value="bankers">Bankers Rounding</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="residualPolicy">Residual Policy</Label>
            <Select id="residualPolicy" {...form.register('residualPolicy')}>
              <option value="merchant">To Merchant</option>
              <option value="platform">To Platform</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bnplFeeSource">BNPL Fee Source</Label>
            <Select id="bnplFeeSource" {...form.register('bnplFeeSource')}>
              <option value="platform">Platform Bears Fee</option>
              <option value="merchant">Merchant Bears Fee</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumOrderAmount">Minimum Order Amount</Label>
            <Input
              id="minimumOrderAmount"
              type="number"
              step="0.01"
              {...form.register('minimumOrderAmount', { valueAsNumber: true })}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Settlement Configuration</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoSettlement">Auto Settlement</Label>
              <p className="text-sm text-gray-500">
                Enable automatic settlement processing
              </p>
            </div>
            <Switch
              id="autoSettlement"
              checked={form.watch('autoSettlementEnabled')}
              onCheckedChange={(checked) =>
                form.setValue('autoSettlementEnabled', checked)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="defaultSettlementDelay">
                Default Settlement Delay (Days)
              </Label>
              <Input
                id="defaultSettlementDelay"
                type="number"
                {...form.register('defaultSettlementDelay', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instantSettlementThreshold">
                Instant Settlement Threshold
              </Label>
              <Input
                id="instantSettlementThreshold"
                type="number"
                step="0.01"
                {...form.register('instantSettlementThreshold', { valueAsNumber: true })}
              />
              <p className="text-sm text-gray-500">
                Amounts below this threshold are settled instantly
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Split Validation Rules</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowNegative">Allow Negative Splits</Label>
              <p className="text-sm text-gray-500">
                Allow splits to result in negative balances
              </p>
            </div>
            <Switch
              id="allowNegative"
              checked={form.watch('splitValidationRules.allowNegative')}
              onCheckedChange={(checked) =>
                form.setValue('splitValidationRules.allowNegative', checked)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maxSplitPercentage">
                Maximum Split Percentage
              </Label>
              <Input
                id="maxSplitPercentage"
                type="number"
                max="100"
                {...form.register('splitValidationRules.maxSplitPercentage', {
                  valueAsNumber: true,
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minSplitAmount">Minimum Split Amount</Label>
              <Input
                id="minSplitAmount"
                type="number"
                step="0.01"
                {...form.register('splitValidationRules.minSplitAmount', {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Default BNPL Configuration</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maxTenor">Maximum Tenor (Months)</Label>
            <Input
              id="maxTenor"
              type="number"
              {...form.register('defaultBNPLConfig.maxTenor', {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultInterestRate">
              Default Interest Rate (%)
            </Label>
            <Input
              id="defaultInterestRate"
              type="number"
              step="0.01"
              {...form.register('defaultBNPLConfig.defaultInterestRate', {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="processingFeePercentage">
              Processing Fee (%)
            </Label>
            <Input
              id="processingFeePercentage"
              type="number"
              step="0.01"
              {...form.register('defaultBNPLConfig.processingFeePercentage', {
                valueAsNumber: true,
              })}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  );
};