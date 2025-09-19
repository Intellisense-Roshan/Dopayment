import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RefundRequest, Refund, SplitResult } from '../types/bnpl';
import { RefundSchema } from '../types/refund';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Card } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { SplitPreview } from './split-preview';

interface RefundWizardProps {
  isOpen: boolean;
  onClose: () => void;
  originalSplits: SplitResult[];
  orderAmount: number;
  onSubmit: (request: RefundRequest) => Promise<Refund>;
}

export const RefundWizard: React.FC<RefundWizardProps> = ({
  isOpen,
  onClose,
  originalSplits,
  orderAmount,
  onSubmit,
}) => {
  const [step, setStep] = useState<'amount' | 'confirm'>('amount');
  const [splitPreview, setSplitPreview] = useState<SplitResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RefundRequest>({
    resolver: zodResolver(RefundSchema),
    defaultValues: {
      amount: orderAmount,
      reason: '',
    },
  });

  const calculateRefundSplits = (amount: number) => {
    const ratio = amount / orderAmount;
    return originalSplits.map(split => ({
      ...split,
      amount: split.amount * ratio,
      status: 'pending' as const,
    }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (!isNaN(amount) && amount > 0 && amount <= orderAmount) {
      setSplitPreview(calculateRefundSplits(amount));
      setError(null);
    } else {
      setError('Invalid refund amount');
      setSplitPreview([]);
    }
  };

  const handleSubmit = async (data: RefundRequest) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process refund');
    }
  };

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {step === 'amount' && (
            <div className="space-y-6">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Refund Amount</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">₹</span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        max={orderAmount}
                        {...form.register('amount')}
                        onChange={(e) => {
                          form.register('amount').onChange(e);
                          handleAmountChange(e);
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Maximum refund amount: {formatAmount(orderAmount)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Refund</Label>
                    <Textarea
                      id="reason"
                      {...form.register('reason')}
                      placeholder="Please provide a reason for the refund"
                    />
                  </div>
                </div>
              </Card>

              {splitPreview.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Refund Split Preview</h3>
                  <SplitPreview
                    preview={{
                      orderAmount: parseFloat(form.watch('amount')),
                      bnplFees: 0,
                      netToSplit: parseFloat(form.watch('amount')),
                      splits: splitPreview,
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-4">
                    * Refund amounts will be deducted proportionally from each party's balance
                  </p>
                </Card>
              )}

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={!splitPreview.length || !!error}
                  onClick={() => setStep('confirm')}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Confirm Refund</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount to Refund:</span>
                    <span className="font-semibold">
                      {formatAmount(parseFloat(form.watch('amount')))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span>{form.watch('reason')}</span>
                  </div>
                </div>
              </Card>

              {splitPreview.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Final Split Breakdown</h3>
                  <SplitPreview
                    preview={{
                      orderAmount: parseFloat(form.watch('amount')),
                      bnplFees: 0,
                      netToSplit: parseFloat(form.watch('amount')),
                      splits: splitPreview,
                    }}
                  />
                </Card>
              )}

              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Please review the refund details carefully. This action cannot be undone.
                </p>
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('amount')}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={!!error}
                >
                  Process Refund
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};