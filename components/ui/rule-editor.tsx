import React, { useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  type SplitRule,
  TargetType, 
  AmountType, 
  RuleScope, 
  PayoutMode,
  SplitRuleSchema
} from '@/types/bnpl.ts';
import { Input } from './input';
import { Button } from './button';
import { Select } from './select';
import { Switch } from './switch';
import { Card } from './card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Label } from './label';

interface RuleEditorProps {
  rule?: SplitRule;
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: SplitRule) => void;
}

export const RuleEditor: React.FC<RuleEditorProps> = ({
  rule,
  isOpen,
  onClose,
  onSave,
}) => {
  const form = useForm<SplitRule>({
    resolver: zodResolver(SplitRuleSchema),
    defaultValues: rule || {
      name: '',
      scope: RuleScope.GLOBAL,
      priority: 0,
      isActive: true,
      effectiveFrom: new Date().toISOString().split('T')[0],
      splits: [],
      settlementPolicy: {
        payoutDelayDays: 0,
        payoutMode: PayoutMode.AUTO,
      },
      version: 1,
      allowNegative: false,
      roundingRule: 'halfUp',
      residualPolicy: 'merchant',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'splits',
  });

  const handleSubmit = useCallback(async (data: SplitRule) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving rule:', error);
    }
  }, [onSave, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {rule ? 'Edit Split Rule' : 'Create New Split Rule'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Enter rule name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope">Scope</Label>
              <Select {...form.register('scope')}>
                {Object.entries(RuleScope).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Split Configuration</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-4 gap-4 mb-4">
                <Select {...form.register(`splits.${index}.targetType`)}>
                  {Object.entries(TargetType).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </option>
                  ))}
                </Select>

                <Select {...form.register(`splits.${index}.amountType`)}>
                  {Object.entries(AmountType).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </option>
                  ))}
                </Select>

                <Input
                  type="number"
                  step="0.01"
                  {...form.register(`splits.${index}.value`)}
                  placeholder="Amount/Percentage"
                />

                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    {...form.register(`splits.${index}.applyOrder`)}
                    placeholder="Order"
                    className="w-20"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  targetType: TargetType.MERCHANT,
                  targetId: '',
                  amountType: AmountType.PERCENTAGE,
                  value: 0,
                  applyOrder: fields.length,
                })
              }
            >
              Add Split
            </Button>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Settlement Policy</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payoutDelay">Payout Delay (Days)</Label>
                <Input
                  type="number"
                  id="payoutDelay"
                  {...form.register('settlementPolicy.payoutDelayDays')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payoutMode">Payout Mode</Label>
                <Select {...form.register('settlementPolicy.payoutMode')}>
                  {Object.entries(PayoutMode).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Advanced Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="allowNegative">Allow Negative Splits</Label>
                <Switch
                  id="allowNegative"
                  checked={form.watch('allowNegative')}
                  onCheckedChange={(checked) =>
                    form.setValue('allowNegative', checked)
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roundingRule">Rounding Rule</Label>
                  <Select {...form.register('roundingRule')}>
                    <option value="halfUp">Half Up</option>
                    <option value="bankers">Bankers</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residualPolicy">Residual Policy</Label>
                  <Select {...form.register('residualPolicy')}>
                    <option value="merchant">To Merchant</option>
                    <option value="platform">To Platform</option>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Rule</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};