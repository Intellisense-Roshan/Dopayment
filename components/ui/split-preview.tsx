import React from 'react';
import { Card } from './card';
import { Separator } from './separator';
import type { SplitPreviewResponse } from '../types/bnpl';

interface SplitPreviewProps {
  preview: SplitPreviewResponse;
  compact?: boolean;
}

export const SplitPreview: React.FC<SplitPreviewProps> = ({
  preview,
  compact = false,
}) => {
  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  const renderSplitRow = (
    label: string,
    amount: number,
    scheduledDate?: string
  ) => (
    <div className="flex justify-between py-2">
      <div className="space-y-1">
        <p className="font-medium">{label}</p>
        {!compact && scheduledDate && (
          <p className="text-sm text-gray-500">
            Payout on: {new Date(scheduledDate).toLocaleDateString()}
          </p>
        )}
      </div>
      <p className="font-semibold">{formatAmount(amount)}</p>
    </div>
  );

  return (
    <Card className={compact ? "p-3" : "p-6"}>
      <div className={compact ? "text-sm" : "text-base"}>
        <h3 className="font-semibold mb-4">Payment Breakdown</h3>

        {renderSplitRow("Order Amount", preview.orderAmount)}
        {renderSplitRow("BNPL Fees", preview.bnplFees)}
        
        <Separator className="my-2" />
        
        {renderSplitRow("Net Amount", preview.netToSplit)}
        
        <Separator className="my-2" />

        <div className="space-y-2">
          {preview.splits.map((split, index) => (
            <React.Fragment key={index}>
              {renderSplitRow(
                split.targetType.charAt(0).toUpperCase() + split.targetType.slice(1),
                split.amount,
                split.scheduledPayout
              )}
            </React.Fragment>
          ))}
        </div>

        {!compact && (
          <>
            <Separator className="my-4" />
            <div className="text-sm text-gray-500">
              <p>* All payouts are subject to settlement policies and bank processing times.</p>
              <p>* BNPL fees and platform charges are deducted before splits.</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};