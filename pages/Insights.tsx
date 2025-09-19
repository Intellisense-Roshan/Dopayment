import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  BarChart3,
  Target,
  Award,
  PiggyBank,
  CreditCard,
  ShoppingBag,
  Utensils,
  Car,
  Gamepad2,
  Zap,
  ArrowUpRight,
  Trophy
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Area,
  AreaChart,
  Pie
} from 'recharts';
import { mockSpendingInsights, mockRewards, mockTransactions } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Insights: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate insights from mock data
  const totalSpent = mockTransactions
    .filter(t => t.type === 'sent' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceived = mockTransactions
    .filter(t => t.type === 'received' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalReceived - totalSpent;
  const transactionCount = mockTransactions.length;

  const budgetGoal = 8000;
  const budgetProgress = (totalSpent / budgetGoal) * 100;
  const savingsGoal = 2000;
  const currentSavings = Math.max(0, savings);
  const savingsProgress = (currentSavings / savingsGoal) * 100;

  // Category spending data
  const categoryData = mockSpendingInsights.map(insight => ({
    name: insight.category,
    value: insight.amount,
    percentage: insight.percentage,
    transactions: insight.transactions,
    color: getCategoryColor(insight.category)
  }));

  // Monthly spending data (mock)
  const monthlyData = [
    { month: 'Jan', spent: 8500, received: 12000, savings: 3500 },
    { month: 'Feb', spent: 9200, received: 11000, savings: 1800 },
    { month: 'Mar', spent: 7800, received: 13500, savings: 5700 },
    { month: 'Apr', spent: 10200, received: 12800, savings: 2600 },
    { month: 'May', spent: 8800, received: 14200, savings: 5400 },
    { month: 'Jun', spent: 12450, received: 15200, savings: 2750 }
  ];

  // Weekly spending data (mock)
  const weeklyData = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 800 },
    { day: 'Wed', amount: 1500 },
    { day: 'Thu', amount: 900 },
    { day: 'Fri', amount: 2000 },
    { day: 'Sat', amount: 1800 },
    { day: 'Sun', amount: 1100 }
  ];

  function getCategoryColor(category: string) {
    const colors = {
      'Food & Dining': '#FF6B6B',
      'Shopping': '#4ECDC4',
      'Transportation': '#45B7D1',
      'Entertainment': '#96CEB4',
      'Bills & Utilities': '#FFEAA7',
      'Others': '#DDA0DD'
    };
    return colors[category as keyof typeof colors] || '#95A5A6';
  }

  function getCategoryIcon(category: string) {
    const icons = {
      'Food & Dining': Utensils,
      'Shopping': ShoppingBag,
      'Transportation': Car,
      'Entertainment': Gamepad2,
      'Bills & Utilities': Zap,
      'Others': CreditCard
    };
    const IconComponent = icons[category as keyof typeof icons] || CreditCard;
    return <IconComponent className="h-4 w-4" />;
  }

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      
      <div className="p-4 space-y-6">
        {/* Time Range Selector */}
        <div className="flex justify-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Total Received</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(totalReceived)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingDown className="h-5 w-5 text-red-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Total Spent</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(totalSpent)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <PiggyBank className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Savings</p>
                  <p className={`text-lg font-bold ${savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(savings))}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Transactions</p>
                  <p className="text-lg font-bold text-purple-600">
                    {transactionCount}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Budget Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Budget Goal
                  <Badge variant="outline">January 2025</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Monthly Target</span>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(totalSpent)} / {formatCurrency(budgetGoal)}
                    </span>
                  </div>
                  <Progress 
                    value={budgetProgress} 
                    className="h-3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {budgetProgress > 100 ? 'Over budget by' : 'Remaining:'} {' '}
                    {formatCurrency(Math.abs(budgetGoal - totalSpent))}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Area 
                        type="monotone" 
                        dataKey="spent" 
                        stackId="1" 
                        stroke="#FF6B6B" 
                        fill="#FF6B6B" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="received" 
                        stackId="2" 
                        stroke="#4ECDC4" 
                        fill="#4ECDC4" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Spending Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Spending Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="amount" fill="#45B7D1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spending" className="space-y-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Details */}
            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold">{category.name}</h4>
                          <p className="text-sm text-gray-600">{category.transactions} transactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(category.value)}</p>
                        <p className="text-sm text-gray-600">{category.percentage}%</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            {/* Rewards Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Your Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {mockRewards.map((reward) => (
                    <motion.div
                      key={reward.id}
                      whileHover={{ scale: 1.05 }}
                      className={`p-4 rounded-lg border-2 ${
                        reward.achieved 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                          reward.achieved ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Award className={`h-6 w-6 ${
                            reward.achieved ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <h4 className="font-semibold text-sm">{reward.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{reward.description}</p>
                        <Badge variant={reward.achieved ? 'default' : 'secondary'}>
                          {reward.points} points
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievement Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Achievement Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Points</span>
                    <span className="text-lg font-bold text-blue-600">1,250</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: '75%' }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">Next milestone: 1,500 points</p>
                </div>
              </CardContent>
            </Card>

            {/* Savings Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Savings Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Monthly Target</span>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(currentSavings)} / {formatCurrency(savingsGoal)}
                    </span>
                  </div>
                  <Progress value={savingsProgress} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {savingsProgress.toFixed(0)}% completed
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Add to Savings
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Set Auto-Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Smart Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Smart Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <TrendingDown className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Reduce Food Spending</p>
                      <p className="text-xs text-blue-700">
                        You've spent 35% more on food this month. Consider cooking at home more often.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-2">
                    <PiggyBank className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Great Savings Streak!</p>
                      <p className="text-xs text-green-700">
                        You're on track to exceed your savings goal by ₹150 this month.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <CreditCard className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Switch to UPI</p>
                      <p className="text-xs text-yellow-700">
                        Save on transaction fees by using UPI instead of cards for small payments.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};