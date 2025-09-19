import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Send, 
  Download, 
  QrCode, 
  Smartphone, 
  CreditCard,
  Split,
  Plus,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { icon: Send, label: 'Send', path: '/payments/send' },
    { icon: Download, label: 'Request', path: '/payments/request' },
    { icon: QrCode, label: 'QR Pay', path: '/qr' },
    { icon: Smartphone, label: 'UPI', path: '/payments/upi' },
    { icon: Split, label: 'Split', path: '/payments/split' },
    { icon: CreditCard, label: 'Cards', path: '/payments/cards' },
    { icon: Plus, label: 'Top Up', path: '/payments/topup' },
    { icon: History, label: 'More', path: '/transactions' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {actions.map(({ icon: Icon, label, path }) => (
        <Button
          key={label}
          variant="ghost"
          className="flex flex-col h-20 p-2 hover:bg-gray-100"
          onClick={() => navigate(path)}
        >
          <div className="p-2 bg-blue-100 rounded-full mb-2">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-gray-700">{label}</span>
        </Button>
      ))}
    </div>
  );
};