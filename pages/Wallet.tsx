import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import '@/styles/wallet.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building,
  TrendingUp,
  Send,
  ArrowLeftRight
} from 'lucide-react';
import { mockWalletAccounts } from '@/data/mockData';
import { SendMoneyDialog } from '@/components/ui/send-money-dialog';

export const WalletPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
  const primaryWallet = mockWalletAccounts.find(w => w.isPrimary);

  const recentActivity = [
    {
      id: '1',
      type: 'sent',
      amount: 450.00,
      currency: 'USD',
      description: 'Payment to Amazon',
      date: '2025-09-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'received',
      amount: 1200.00,
      currency: 'USD',
      description: 'Client Payment',
      date: '2025-09-14',
      status: 'completed'
    }
  ];

  return (
    <div className="pb-20">
      {/* Main Balance Card */}
      <div className="p-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-blue-100">Total Balance</p>
              <h1 className="text-4xl font-bold">
                {primaryWallet?.currency} {primaryWallet?.balance.toLocaleString()}
              </h1>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                  Available
                </Badge>
                <ArrowRight className="h-4 w-4 text-blue-100" />
                <span className="text-sm text-blue-100">Instant transfer available</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button 
                variant="secondary" 
                className="bg-white/10 hover:bg-white/20 text-white"
                onClick={() => setIsSendMoneyOpen(true)}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Link Bank</h3>
                  <p className="text-sm text-gray-500">Add your bank account</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Add Card</h3>
                  <p className="text-sm text-gray-500">Link debit/credit card</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity and Insights Tabs */}
      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-4 space-y-4">
            {recentActivity.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'sent' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {activity.type === 'sent' ? (
                          <ArrowUpRight className="h-5 w-5 text-red-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{activity.description}</h3>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        activity.type === 'sent' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {activity.type === 'sent' ? '-' : '+'}{activity.currency} {activity.amount.toLocaleString()}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full">
              View All Transactions
            </Button>
          </TabsContent>

          <TabsContent value="insights" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">This Month</h4>
                        <p className="text-sm text-gray-500">Total spending</p>
                      </div>
                    </div>
                    <p className="font-medium">USD 2,450.75</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full progress-bar" />
                  </div>
                  <p className="text-sm text-gray-500">65% of monthly budget used</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Send Money Dialog */}
      <SendMoneyDialog 
        isOpen={isSendMoneyOpen}
        onClose={() => setIsSendMoneyOpen(false)}
      />
    </div>
  );
};