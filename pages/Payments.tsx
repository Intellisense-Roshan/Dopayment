import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  CreditCard, 
  Smartphone, 
  QrCode, 
  Users,
  ArrowRight,
  User,
  Phone,
  Mail,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  AlertCircle,
  Wallet,
  Building,
  Split,
  Download,
  Clock3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockUPIAccounts, mockBankAccounts, mockSplitPayments } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

export const Payments: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('send');
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [splitParticipants, setSplitParticipants] = useState([
    { id: 1, name: '', amount: 0, phone: '' }
  ]);
  const [splitTotal, setSplitTotal] = useState(0);
  const [splitDescription, setSplitDescription] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'wallet' | 'bank'>('wallet');

  const handleAddParticipant = () => {
    setSplitParticipants(prev => [
      ...prev,
      { id: Date.now(), name: '', amount: 0, phone: '' }
    ]);
  };

  const handleRemoveParticipant = (id: number) => {
    if (splitParticipants.length > 1) {
      setSplitParticipants(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleParticipantChange = (id: number, field: string, value: string | number) => {
    setSplitParticipants(prev => 
      prev.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  const calculateSplitTotal = () => {
    const total = splitParticipants.reduce((sum, p) => sum + p.amount, 0);
    setSplitTotal(total);
  };

  React.useEffect(() => {
    calculateSplitTotal();
  }, [splitParticipants]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      
      <div className="p-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="send">Send</TabsTrigger>
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="split">Split</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-6">
            {/* Quick Send Options */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Send className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold">Send Money</h3>
                  <p className="text-sm text-gray-600">Transfer to contacts</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <QrCode className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold">Scan & Pay</h3>
                  <p className="text-sm text-gray-600">QR code payments</p>
                </CardContent>
              </Card>
            </div>

            {/* Send Money Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send Money</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipient">To</Label>
                  <div className="relative">
                    <Input
                      id="recipient"
                      placeholder="Enter UPI ID, phone, or name"
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                  />
                </div>
                
                <div>
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Input
                    id="note"
                    placeholder="Add a note"
                  />
                </div>

                <div>
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button 
                      variant={selectedPaymentMethod === 'wallet' ? 'default' : 'outline'} 
                      className="h-12"
                      onClick={() => setSelectedPaymentMethod('wallet')}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Wallet
                    </Button>
                    <Button 
                      variant={selectedPaymentMethod === 'bank' ? 'default' : 'outline'} 
                      className="h-12"
                      onClick={() => setSelectedPaymentMethod('bank')}
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Bank Account
                    </Button>
                  </div>
                </div>
                
                <Button className="w-full">
                  Send Money
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Recent Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">P</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Priya Sharma</h4>
                      <p className="text-sm text-gray-600">+91 98765 43211</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">R</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Rahul Singh</h4>
                      <p className="text-sm text-gray-600">+91 98765 43212</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="request" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Money</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="request-amount">Amount (₹)</Label>
                  <Input
                    id="request-amount"
                    type="number"
                    placeholder="Enter amount"
                  />
                </div>
                
                <div>
                  <Label htmlFor="request-note">Note (Optional)</Label>
                  <Input
                    id="request-note"
                    placeholder="Add a note"
                  />
                </div>

                <div>
                  <Label>Request From</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Input placeholder="Enter UPI ID or phone" />
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  Send Request
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="split" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Split className="h-5 w-5" />
                  <span>Split Bill</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <Users className="h-12 w-12 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold mb-2">Split Expenses</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Easily split bills with friends and family
                    </p>
                    <Dialog open={showSplitDialog} onOpenChange={setShowSplitDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Split
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Create Split Bill</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="split-description">Description</Label>
                            <Input
                              id="split-description"
                              placeholder="e.g., Dinner at Restaurant"
                              value={splitDescription}
                              onChange={(e) => setSplitDescription(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label>Participants</Label>
                            <div className="space-y-2 mt-2">
                              {splitParticipants.map((participant) => (
                                <div key={participant.id} className="flex items-center space-x-2">
                                  <Input
                                    placeholder="Name"
                                    value={participant.name}
                                    onChange={(e) => handleParticipantChange(participant.id, 'name', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={participant.amount || ''}
                                    onChange={(e) => handleParticipantChange(participant.id, 'amount', parseFloat(e.target.value) || 0)}
                                    className="w-24"
                                  />
                                  {splitParticipants.length > 1 && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRemoveParticipant(participant.id)}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            <Button
                              variant="outline"
                              onClick={handleAddParticipant}
                              className="w-full mt-2"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Participant
                            </Button>
                          </div>

                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Total:</span>
                              <span className="font-bold text-lg">{formatCurrency(splitTotal)}</span>
                            </div>
                          </div>

                          <Button
                            onClick={() => setShowSplitDialog(false)}
                            className="w-full"
                            disabled={splitTotal === 0}
                          >
                            Create Split Bill
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Active Splits */}
                  <div className="space-y-3">
                    {mockSplitPayments.map((split) => (
                      <motion.div
                        key={split.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{split.description}</h4>
                          <Badge variant={split.status === 'completed' ? 'default' : 'secondary'}>
                            {split.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Total: {formatCurrency(split.totalAmount)}
                        </p>
                        <div className="space-y-2">
                          {split.participants.map((participant, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{participant.name}</span>
                              <div className="flex items-center space-x-2">
                                <span>{formatCurrency(participant.amount)}</span>
                                {participant.status === 'paid' ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-yellow-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pay Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold mb-2">Bill Payments</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Pay your utility bills and services
                  </p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bill
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {mockUPIAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{account.upiId}</h4>
                      <p className="text-sm text-gray-600">{account.bankName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {account.isPrimary && <Badge variant="default">Primary</Badge>}
                    {account.isVerified && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                </div>
              ))}
              
              {mockBankAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{account.bankName}</h4>
                      <p className="text-sm text-gray-600">{account.accountNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {account.isPrimary && <Badge variant="default">Primary</Badge>}
                    {account.isVerified && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};