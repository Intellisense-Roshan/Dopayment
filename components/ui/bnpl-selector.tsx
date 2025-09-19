import React, { useState, useEffect } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Label } from './label';
import { RadioGroup } from './radio-group';
import { Separator } from './separator';
import { SplitPreview } from './split-preview';
import { type BNPLPlan, type SplitPreviewResponse } from '../../types/bnpl';

interface BNPLSelectorProps {
  orderAmount: number;
  merchantId: string;
  storeId: string;
  onPlanSelected: (plan: BNPLPlan) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BNPLSelector: React.FC<BNPLSelectorProps> = ({
  orderAmount,
  merchantId,
  storeId,
  onPlanSelected,
  onConfirm,
  onCancel,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<BNPLPlan | null>(null);
  const [splitPreview, setSplitPreview] = useState<SplitPreviewResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const plans: BNPLPlan[] = [
    { tenorMonths: 3, interestRate: 0, processingFee: 99 },
    { tenorMonths: 6, interestRate: 1.5, processingFee: 199 },
    { tenorMonths: 12, interestRate: 2.5, processingFee: 299 },
  ];

  // Calculate EMI for a plan
  const calculateEMI = (principal: number, plan: BNPLPlan) => {
    const r = plan.interestRate / 100 / 12; // Monthly interest rate
    const n = plan.tenorMonths;

    if (plan.interestRate === 0) {
      return Math.ceil((principal + (plan.processingFee || 0)) / n);
    }

    const emi =
      (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.ceil(emi + (plan.processingFee || 0) / n);
  };

  useEffect(() => {
    const fetchSplitPreview = async () => {
      if (!selectedPlan) return;

      setIsLoading(true);
      try {
        // Mock API call - replace with actual API
        const response = await fetch('/api/v1/bnpl/preview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            merchantId,
            storeId,
            cart: [{ price: orderAmount, qty: 1 }],
            selectedPlan,
          }),
        });

        const preview = await response.json();
        setSplitPreview(preview.data);
        onPlanSelected(selectedPlan);
      } catch (error) {
        console.error('Failed to fetch split preview:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSplitPreview();
  }, [selectedPlan, merchantId, storeId, orderAmount, onPlanSelected]);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Select Payment Plan</h2>
          <RadioGroup
            value={selectedPlan ? JSON.stringify(selectedPlan) : ''}
            onValueChange={(value) =>
              setSelectedPlan(JSON.parse(value) as BNPLPlan)
            }
          >
            <div className="grid gap-4">
              {plans.map((plan, index) => {
                const emi = calculateEMI(orderAmount, plan);
                const totalAmount = emi * plan.tenorMonths;

                return (
                  <label
                    key={index}
                    className="relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="font-medium">
                            {plan.tenorMonths} Monthly Payments
                          </p>
                          {plan.interestRate > 0 && (
                            <p className="text-sm text-gray-500">
                              {plan.interestRate}% monthly interest
                            </p>
                          )}
                        </div>
                        <p className="font-semibold">₹{emi}/mo</p>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>Processing fee: ₹{plan.processingFee}</p>
                        <p>Total: ₹{totalAmount}</p>
                        {totalAmount > orderAmount && (
                          <p className="text-xs">
                            (includes ₹{totalAmount - orderAmount} in interest and
                            fees)
                          </p>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        {selectedPlan && splitPreview && (
          <>
            <Separator />
            <div>
              <Label className="mb-2">Payment Distribution</Label>
              <SplitPreview preview={splitPreview} compact />
            </div>
          </>
        )}

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!selectedPlan || isLoading}
          >
            {isLoading ? 'Loading...' : 'Confirm Payment Plan'}
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p>
            * By confirming, you agree to the BNPL terms and conditions.
            Processing fees and interest rates are subject to change.
          </p>
        </div>
      </div>
    </Card>
  );
};