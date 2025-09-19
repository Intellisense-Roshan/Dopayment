import React from 'react';
import { BalanceCard } from '@/components/ui/balance-card';
import { QuickActions } from '@/components/ui/quick-actions';
import { TransactionItem } from '@/components/ui/transaction-item';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { mockWalletBalance, mockTransactions } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const recentTransactions = mockTransactions.slice(0, 5);

  return (
    <div className="pb-20">
      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <BalanceCard balance={mockWalletBalance} />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <QuickActions />
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/transactions')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentTransactions.length > 0 ? (
              <div className="divide-y">
                {recentTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onClick={() => navigate(`/transactions/${transaction.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>No recent transactions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* KYC Status */}
        {user?.kycStatus !== 'full' && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-yellow-800">Complete your KYC</h3>
                  <p className="text-sm text-yellow-700">
                    Unlock higher transaction limits and more features
                  </p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => navigate('/kyc')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};