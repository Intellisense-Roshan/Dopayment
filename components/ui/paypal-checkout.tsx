import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface PayPalCheckoutProps {
  amount: number;
  orderId?: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  onCancel: () => void;
}

export const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({
  amount,
  orderId,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePayPalClick = async () => {
    setIsLoading(true);
    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      const mockPaymentDetails = {
        orderId: orderId || 'MOCK_ORDER_123',
        transactionId: 'MOCK_TXN_' + Math.random().toString(36).substr(2, 9),
        amount: amount,
        currency: 'INR',
        status: 'COMPLETED',
        paymentTime: new Date().toISOString(),
      };

      setShowConfirmation(true);
      onSuccess(mockPaymentDetails);
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handlePayPalClick}
        disabled={isLoading}
        className="w-full"
        variant="outline"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <img src="/paypal-logo.png" alt="PayPal" className="h-5" />
        )}
        {isLoading ? 'Processing...' : 'Pay with PayPal'}
      </Button>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Successful</DialogTitle>
            <DialogDescription>
              Your payment of ₹{amount.toLocaleString()} has been processed successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-green-50 rounded-lg mt-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p>Amount: ₹{amount.toLocaleString()}</p>
              <p>Order ID: {orderId || 'MOCK_ORDER_123'}</p>
              <p>Status: Completed</p>
              <p>Time: {new Date().toLocaleString()}</p>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => setShowConfirmation(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};