import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Building, Search, ArrowRight } from 'lucide-react';

interface SendMoneyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  recentTransaction?: string;
}

const recentContacts: Contact[] = [
  { id: '1', name: 'Priya Sharma', recentTransaction: '2 days ago' },
  { id: '2', name: 'Alex Johnson', recentTransaction: '5 days ago' },
  { id: '3', name: 'Sarah Williams', recentTransaction: 'Last week' },
];

export const SendMoneyDialog: React.FC<SendMoneyDialogProps> = ({ isOpen, onClose }) => {
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'bank'>('wallet');
  const [step, setStep] = useState<'contact' | 'amount' | 'confirm'>('contact');

  const handleNext = () => {
    if (step === 'contact' && selectedContact) {
      setStep('amount');
    } else if (step === 'amount' && amount) {
      setStep('confirm');
    }
  };

  const handleBack = () => {
    if (step === 'amount') {
      setStep('contact');
    } else if (step === 'confirm') {
      setStep('amount');
    }
  };

  const handleSend = () => {
    // Implement send money logic here
    console.log('Sending money:', {
      to: selectedContact,
      amount,
      note,
      paymentMethod,
    });
    onClose();
    // Reset form
    setSelectedContact('');
    setAmount('');
    setNote('');
    setPaymentMethod('wallet');
    setStep('contact');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader className="bg-white">
          <DialogTitle>Send Money</DialogTitle>
        </DialogHeader>

        {step === 'contact' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name, UPI ID, or phone"
                className="pl-10"
              />
            </div>

            <div className="space-y-4">
              <Label>Recent Contacts</Label>
              <div className="space-y-2">
                {recentContacts.map((contact) => (
                  <Card
                    key={contact.id}
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedContact === contact.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedContact(contact.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          {contact.avatar ? (
                            <img src={contact.avatar} alt={contact.name} />
                          ) : (
                            <div className="bg-blue-100 w-full h-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {contact.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          {contact.recentTransaction && (
                            <p className="text-sm text-gray-500">
                              Last transaction: {contact.recentTransaction}
                            </p>
                          )}
                        </div>
                      </div>
                      {selectedContact === contact.id && (
                        <Badge className="bg-blue-100 text-blue-600">Selected</Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!selectedContact}
              onClick={handleNext}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 'amount' && (
          <div className="space-y-4">
            <div>
              <Label>Amount</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label>Note (Optional)</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as 'wallet' | 'bank')}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                <div>
                  <RadioGroupItem
                    value="wallet"
                    id="wallet"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="wallet"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
                  >
                    <Wallet className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Wallet</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem
                    value="bank"
                    id="bank"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="bank"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
                  >
                    <Building className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Bank</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button 
                className="flex-1"
                disabled={!amount}
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">To</span>
                  <span className="font-medium">
                    {recentContacts.find(c => c.id === selectedContact)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">₹{amount}</span>
                </div>
                {note && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Note</span>
                    <span className="font-medium">{note}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">{paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSend}
              >
                Send Money
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};