import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Wallet, Building } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { WalletBalance } from '@/types';

interface BalanceCardProps {
  balance: WalletBalance;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-blue-100">Total Balance</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalance(!showBalance)}
            className="text-white hover:text-blue-100"
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="mb-6">
          <p className="text-3xl font-bold">
            {showBalance ? formatCurrency(balance.total) : '••••••••'}
          </p>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-4 w-4 text-blue-200" />
            <div>
              <p className="text-xs text-blue-200">Wallet</p>
              <p className="text-sm font-semibold">
                {showBalance ? formatCurrency(balance.wallet) : '••••••'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-blue-200" />
            <div>
              <p className="text-xs text-blue-200">Bank</p>
              <p className="text-sm font-semibold">
                {showBalance ? formatCurrency(balance.bank) : '••••••'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};