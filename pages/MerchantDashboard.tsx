import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users,
  Calendar,
  Download,
  QrCode,
  Settings,
  BarChart3,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { mockMerchantData, mockTransactions } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const salesData = [
  { day: 'Mon', amount: 1200 },
  { day: 'Tue', amount: 1900 },
  { day: 'Wed', amount: 3000 },
  { day: 'Thu', amount: 2500 },
  { day: 'Fri', amount: 3200 },
  { day: 'Sat', amount: 4100 },
  { day: 'Sun', amount: 2800 },
];

const paymentMethods = [
  { method: 'UPI', count: 45, percentage: 60 },
  { method: 'QR', count: 20, percentage: 27 },
  { method: 'Cards', count: 10, percentage: 13 },
];

export const MerchantDashboard: React.FC = () => {
  const merchantTransactions = mockTransactions.filter(t => t.type === 'received');
  const todayProgress = (mockMerchantData.todayEarnings / 5000) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      
      <div className="p-4 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Earnings</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(mockMerchantData.todayEarnings)}
                  </p>
                  <div className="mt-2">
                    <Progress value={todayProgress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {todayProgress.toFixed(0)}% of daily goal
                    </p>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Settlement</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(mockMerchantData.pendingSettlements)}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {mockMerchantData.settlementSchedule}
                  </Badge>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {mockMerchantData.totalTransactions}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Today</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Transaction</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(mockMerchantData.todayEarnings / mockMerchantData.totalTransactions)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Per transaction</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Sales']} />
                  <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {method.method === 'UPI' && <Smartphone className="h-4 w-4 text-blue-600" />}
                    {method.method === 'QR' && <QrCode className="h-4 w-4 text-green-600" />}
                    {method.method === 'Cards' && <CreditCard className="h-4 w-4 text-purple-600" />}
                    <span className="font-medium">{method.method}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{method.count} txns</span>
                    <Badge variant="secondary">{method.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Payments</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {merchantTransactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{transaction.senderName}</p>
                  <p className="text-sm text-gray-600">{transaction.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    +{formatCurrency(transaction.amount)}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {transaction.paymentMode.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12">
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR
              </Button>
              <Button variant="outline" className="h-12">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" className="h-12">
                <Calendar className="h-4 w-4 mr-2" />
                Settlement Schedule
              </Button>
              <Button variant="outline" className="h-12">
                <Settings className="h-4 w-4 mr-2" />
                Business Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};