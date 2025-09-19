import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CreditCard, QrCode, History, Settings, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/payments', icon: CreditCard, label: 'Pay' },
  { path: '/wallet', icon: History, label: 'Wallet' },
  { path: '/qr', icon: QrCode, label: 'QR' },
  { path: '/bnpl', icon: Clock, label: 'BNPL' },
  { path: '/transactions', icon: History, label: 'History' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'flex flex-col items-center py-2 px-3 rounded-lg transition-colors',
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};