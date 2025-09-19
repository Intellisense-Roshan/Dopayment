import React from 'react';
import { Card } from './card';
import { Badge } from './badge';
import { Separator } from './separator';
import type { Transaction } from '../types/bnpl';

interface TransactionListProps {
  transactions: Transaction[];
  onViewTransaction?: (transaction: Transaction) => void;
}

const statusColors: Record<Transaction['status'], {
  bg: string;
  text: string;
}> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  completed: { bg: 'bg-green-100', text: 'text-green-800' },
  failed: { bg: 'bg-red-100', text: 'text-red-800' },
  reversed: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onViewTransaction,
}) => {
  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Math.abs(amount));

  const getTransactionLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'credit':
        return 'Payment Received';
      case 'debit':
        return 'Payout';
      case 'refund':
        return 'Refund';
      case 'adjustment':
        return 'Adjustment';
      default:
        return type;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <React.Fragment key={transaction.transactionId}>
            <div 
              className="flex items-start justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
              onClick={() => onViewTransaction?.(transaction)}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {getTransactionLabel(transaction.type)}
                  </span>
                  <Badge 
                    className={`${statusColors[transaction.status].bg} ${statusColors[transaction.status].text}`}
                  >
                    {transaction.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  ID: {transaction.orderId}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.createdAt).toLocaleString()}
                </p>
                {transaction.scheduledSettlementDate && transaction.status === 'pending' && (
                  <p className="text-sm text-gray-500">
                    Settles on: {new Date(transaction.scheduledSettlementDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                </p>
                {transaction.settledAt && (
                  <p className="text-sm text-gray-500">
                    Settled: {new Date(transaction.settledAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <Separator />
          </React.Fragment>
        ))}

        {transactions.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No transactions found
          </p>
        )}
      </div>
    </Card>
  );
};