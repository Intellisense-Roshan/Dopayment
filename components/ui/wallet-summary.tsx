import React from 'react';
import { Card } from './card';
import { Button } from './button';
import { Progress } from './progress';

interface WalletSummaryProps {
  wallet: {
    balanceAvailable: number;
    balancePending: number;
    nextPayoutDate?: string;
    lastPayoutDate?: string;
    lastPayoutAmount?: number;
  };
  onRequestPayout?: () => void;
  showPayoutButton?: boolean;
}

export const WalletSummary: React.FC<WalletSummaryProps> = ({
  wallet,
  onRequestPayout,
  showPayoutButton = true,
}) => {
  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  const totalBalance = wallet.balanceAvailable + wallet.balancePending;
  const availablePercentage = totalBalance > 0 ? (wallet.balanceAvailable / totalBalance) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Wallet Balance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-semibold text-green-600">
                {formatAmount(wallet.balanceAvailable)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {formatAmount(wallet.balancePending)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Settlement Progress</span>
            <span className="font-medium">{availablePercentage.toFixed(0)}%</span>
          </div>
          <Progress value={availablePercentage} className="h-2" />
        </div>

        {showPayoutButton && onRequestPayout && wallet.balanceAvailable > 0 && (
          <Button 
            onClick={onRequestPayout}
            className="w-full"
            variant="outline"
          >
            Request Payout
          </Button>
        )}

        <div className="text-sm text-gray-500 space-y-1">
          <p>Next scheduled payout: {wallet.nextPayoutDate ? 
            new Date(wallet.nextPayoutDate).toLocaleDateString() :
            'No scheduled payouts'
          }</p>
          <p>Last payout: {wallet.lastPayoutDate && wallet.lastPayoutAmount ?
            `${formatAmount(wallet.lastPayoutAmount)} on ${new Date(wallet.lastPayoutDate).toLocaleDateString()}` :
            'No previous payouts'
          }</p>
        </div>
      </div>
    </Card>
  );
};