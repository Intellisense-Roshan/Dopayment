import React from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { Card } from './card';
import { Separator } from './separator';
import { useNotifications } from '../../contexts/NotificationContext';
import type { NotificationPayload } from '../../types/notifications';

const NotificationItem: React.FC<{
  notification: NotificationPayload;
  onRead: () => void;
}> = ({ notification, onRead }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getNotificationColor = (type: NotificationPayload['type']) => {
    switch (type) {
      case 'payout_completed':
      case 'refund_completed':
        return 'bg-green-100 text-green-800';
      case 'payout_failed':
        return 'bg-red-100 text-red-800';
      case 'payout_scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'reconciliation_mismatch':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`p-4 rounded-lg transition-colors ${
        notification.readAt ? 'bg-white' : 'bg-blue-50'
      }`}
      role="button"
      onClick={onRead}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className={getNotificationColor(notification.type)}>
              {notification.type.replace('_', ' ')}
            </Badge>
            {!notification.readAt && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>
          <h4 className="font-medium">{notification.title}</h4>
          <p className="text-sm text-gray-600">{notification.message}</p>
          {notification.amount && (
            <p className="text-sm font-medium">{formatAmount(notification.amount)}</p>
          )}
          {notification.payoutDate && (
            <p className="text-sm text-gray-500">
              Scheduled: {formatDate(notification.payoutDate)}
            </p>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(notification.createdAt)}
        </span>
      </div>
    </div>
  );
};

interface NotificationListProps {
  maxHeight?: string;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  maxHeight = '400px',
}) => {
  const { notifications, markAsRead, clearAll } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <Card className="w-full max-w-md">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500">{unreadCount} unread</p>
          )}
        </div>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        )}
      </div>

      <Separator />

      <div
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.reference}
                notification={notification}
                onRead={() =>
                  !notification.readAt && markAsRead(notification.reference!)
                }
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};