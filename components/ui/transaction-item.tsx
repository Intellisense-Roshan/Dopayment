import React from 'react';
import { Transaction } from '@/types';
import { formatCurrency, formatTime } from '@/lib/utils';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  AlertCircle,
  CreditCard,
  Smartphone,
  QrCode,
  Building
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

const paymentModeIcons = {
  upi: Smartphone,
  wallet: CreditCard,
  qr: QrCode,
  bank: Building,
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onClick,
}) => {
  const PaymentIcon = paymentModeIcons[transaction.paymentMode];
  
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'sent':
        return ArrowUpRight;
      case 'received':
        return ArrowDownLeft;
      default:
        return transaction.status === 'pending' ? Clock : CreditCard;
    }
  };

  const TransactionIcon = getTransactionIcon();

  const getAmountColor = () => {
    if (transaction.status === 'failed') return 'text-red-600';
    return transaction.type === 'received' ? 'text-green-600' : 'text-red-600';
  };

  const getAmountPrefix = () => {
    if (transaction.type === 'received') return '+';
    return '-';
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 hover:bg-gray-50 transition-colors',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className={cn(
          'p-2 rounded-full',
          transaction.status === 'completed' ? 'bg-blue-100' :
          transaction.status === 'pending' ? 'bg-yellow-100' :
          'bg-red-100'
        )}>
          <TransactionIcon className={cn(
            'h-4 w-4',
            transaction.status === 'completed' ? 'text-blue-600' :
            transaction.status === 'pending' ? 'text-yellow-600' :
            'text-red-600'
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {transaction.description}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <PaymentIcon className="h-3 w-3 text-gray-500" />
            <p className="text-xs text-gray-500">
              {formatTime(transaction.timestamp)}
            </p>
            {transaction.status !== 'completed' && (
              <Badge 
                variant={transaction.status === 'pending' ? 'secondary' : 'destructive'}
                className="text-xs"
              >
                {transaction.status}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={cn('text-sm font-semibold', getAmountColor())}>
          {getAmountPrefix()}{formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-gray-500">
          {transaction.type === 'received' 
            ? transaction.senderName 
            : transaction.recipientName}
        </p>
      </div>
    </div>
  );
};