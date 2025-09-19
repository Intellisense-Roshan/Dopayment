import React from 'react';
import { Card } from './card';
import { SplitPreview } from './split-preview';
import type { SplitRule, CartItem, BNPLPlan, SplitPreviewResponse } from '../types/bnpl';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

interface PreviewPanelProps {
  rule?: SplitRule;
  onPreview: (cart: CartItem[], plan: BNPLPlan) => Promise<SplitPreviewResponse>;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  rule,
  onPreview,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [preview, setPreview] = React.useState<SplitPreviewResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [amount, setAmount] = React.useState('1999.00');
  const [tenorMonths, setTenorMonths] = React.useState('3');
  const [interestRate, setInterestRate] = React.useState('1.5');

  const handlePreview = async () => {
    try {
      setLoading(true);
      setError(null);

      const cart: CartItem[] = [
        {
          sku: 'test-item',
          price: parseFloat(amount),
          qty: 1,
          category: 'general',
        },
      ];

      const plan: BNPLPlan = {
        tenorMonths: parseInt(tenorMonths),
        interestRate: parseFloat(interestRate),
      };

      const result = await onPreview(cart, plan);
      setPreview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Rule Preview</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="amount">Order Amount</Label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">₹</span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="tenor">Tenor (Months)</Label>
          <Input
            id="tenor"
            type="number"
            value={tenorMonths}
            onChange={(e) => setTenorMonths(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="interest">Interest Rate (%)</Label>
          <Input
            id="interest"
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>
      </div>

      <Button 
        onClick={handlePreview}
        disabled={loading || !rule}
        className="w-full mb-4"
      >
        {loading ? 'Calculating...' : 'Generate Preview'}
      </Button>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {preview && (
        <SplitPreview preview={preview} />
      )}

      {!rule && (
        <p className="text-gray-500 text-sm text-center">
          Save the rule first to preview splits
        </p>
      )}
    </Card>
  );
};