import React, { useState, useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TransactionItem } from '@/components/ui/transaction-item';
import { mockTransactions, mockDisputes } from '@/data/mockData';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  FileText,
  Eye,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { Transaction, Dispute } from '@/types';

export const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.senderName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const now = new Date();
        const transactionDate = new Date(transaction.timestamp);
        
        switch (dateFilter) {
          case 'today':
            matchesDate = transactionDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = transactionDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = transactionDate >= monthAgo;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [searchTerm, statusFilter, typeFilter, dateFilter]);

  const totalSent = mockTransactions
    .filter(t => t.type === 'sent' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceived = mockTransactions
    .filter(t => t.type === 'received' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = mockTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleDisputeSubmit = () => {
    if (selectedTransaction && disputeReason && disputeDescription) {
      // Create dispute
      const newDispute: Dispute = {
        id: Date.now().toString(),
        transactionId: selectedTransaction.id,
        reason: disputeReason,
        description: disputeDescription,
        status: 'open',
        createdAt: new Date(),
      };
      
      console.log('Dispute created:', newDispute);
      setShowDisputeDialog(false);
      setDisputeReason('');
      setDisputeDescription('');
      setSelectedTransaction(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      
      <div className="p-4 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Received</p>
              <p className="text-sm font-semibold text-green-600">
                {formatCurrency(totalReceived)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-5 w-5 text-red-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Sent</p>
              <p className="text-sm font-semibold text-red-600">
                {formatCurrency(totalSent)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-5 w-5 text-yellow-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Pending</p>
              <p className="text-sm font-semibold text-yellow-600">
                {formatCurrency(pendingAmount)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 bg-white rounded-lg border"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="received">Received</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="request">Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Date Range</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Transactions</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {filteredTransactions.length} transactions
                </Badge>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTransactions.length > 0 ? (
              <div className="divide-y">
                {filteredTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getStatusIcon(transaction.status)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{transaction.description}</h4>
                          <p className="text-sm text-gray-600">
                            {transaction.recipientName || transaction.senderName || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.timestamp)} • {formatTime(transaction.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'sent' || transaction.type === 'payment' 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {transaction.type === 'sent' || transaction.type === 'payment' ? '-' : '+'}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No transactions found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Detail Modal */}
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
            {selectedTransaction && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {getStatusIcon(selectedTransaction.status)}
                  </div>
                  <h3 className="text-xl font-bold">{selectedTransaction.description}</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedTransaction.type === 'sent' || selectedTransaction.type === 'payment' ? '-' : '+'}
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                  <Badge className={`mt-2 ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time</span>
                    <span>{formatDate(selectedTransaction.timestamp)} at {formatTime(selectedTransaction.timestamp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="capitalize">{selectedTransaction.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Mode</span>
                    <span className="uppercase">{selectedTransaction.paymentMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span>{selectedTransaction.category}</span>
                  </div>
                  {selectedTransaction.recipientName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recipient</span>
                      <span>{selectedTransaction.recipientName}</span>
                    </div>
                  )}
                  {selectedTransaction.senderName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sender</span>
                      <span>{selectedTransaction.senderName}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  {selectedTransaction.status === 'failed' && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowDisputeDialog(true)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Raise Dispute
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dispute Dialog */}
        <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Raise Dispute</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dispute-reason">Reason for Dispute</Label>
                <Select value={disputeReason} onValueChange={setDisputeReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transaction-failed">Transaction failed but amount deducted</SelectItem>
                    <SelectItem value="wrong-amount">Wrong amount deducted</SelectItem>
                    <SelectItem value="unauthorized">Unauthorized transaction</SelectItem>
                    <SelectItem value="duplicate">Duplicate transaction</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dispute-description">Description</Label>
                <Input
                  id="dispute-description"
                  placeholder="Please provide more details..."
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDisputeDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDisputeSubmit}
                  disabled={!disputeReason || !disputeDescription}
                  className="flex-1"
                >
                  Submit Dispute
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};