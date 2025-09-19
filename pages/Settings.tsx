import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Mail,
  Lock,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Phone,
  Users,
  Fingerprint,
  Key,
  Target,
  Building,
  Smartphone,
  MessageSquare,
  Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockBankAccounts, mockUPIAccounts, mockWalletAccounts, mockSecuritySettings } from '@/data/mockData';

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [showAddBank, setShowAddBank] = useState(false);
  const [showAddUPI, setShowAddUPI] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [securitySettings, setSecuritySettings] = useState(mockSecuritySettings);

  const handleSecurityToggle = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      
      <div className="p-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{user?.name}</h3>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {user?.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {user?.phone}
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-3">
                      {user?.kycStatus === 'full' ? 'Full KYC' : 'Light KYC'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KYC Status */}
            <Card>
              <CardHeader>
                <CardTitle>KYC Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Verification Status</h4>
                      <p className="text-sm text-gray-600">
                        {user?.kycStatus === 'full' ? 'Fully verified' : 'Basic verification'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={user?.kycStatus === 'full' ? 'default' : 'secondary'}>
                    {user?.kycStatus === 'full' ? 'Complete' : 'Incomplete'}
                  </Badge>
                </div>
                {user?.kycStatus !== 'full' && (
                  <Button className="w-full mt-4">
                    Complete KYC
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Family Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Family Accounts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold mb-2">Manage Family Accounts</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Link family members and set spending limits
                  </p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Family Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">App Lock</h4>
                      <p className="text-sm text-gray-600">Require PIN to open app</p>
                    </div>
                  </div>
                  <Switch 
                    checked={securitySettings.appLock}
                    onCheckedChange={() => handleSecurityToggle('appLock')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Fingerprint className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Biometric Login</h4>
                      <p className="text-sm text-gray-600">Use fingerprint or face ID</p>
                    </div>
                  </div>
                  <Switch 
                    checked={securitySettings.biometricEnabled}
                    onCheckedChange={() => handleSecurityToggle('biometricEnabled')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Extra security for transactions</p>
                    </div>
                  </div>
                  <Switch 
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={() => handleSecurityToggle('twoFactorEnabled')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Alert Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <h4 className="font-medium">Fraud Alerts</h4>
                      <p className="text-sm text-gray-600">Get notified of suspicious activity</p>
                    </div>
                  </div>
                  <Switch 
                    checked={securitySettings.fraudAlerts}
                    onCheckedChange={() => handleSecurityToggle('fraudAlerts')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Transaction Alerts</h4>
                      <p className="text-sm text-gray-600">Notify on all transactions</p>
                    </div>
                  </div>
                  <Switch 
                    checked={securitySettings.transactionAlerts}
                    onCheckedChange={() => handleSecurityToggle('transactionAlerts')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="font-medium">Spending Alerts</h4>
                      <p className="text-sm text-gray-600">Alert when approaching limits</p>
                    </div>
                  </div>
                  <Switch 
                    checked={securitySettings.spendingAlerts}
                    onCheckedChange={() => handleSecurityToggle('spendingAlerts')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {/* Bank Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Bank Accounts</span>
                  <Dialog open={showAddBank} onOpenChange={setShowAddBank}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Bank
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Bank Account</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bank-name">Bank Name</Label>
                          <Input id="bank-name" placeholder="Enter bank name" />
                        </div>
                        <div>
                          <Label htmlFor="account-number">Account Number</Label>
                          <Input id="account-number" placeholder="Enter account number" />
                        </div>
                        <div>
                          <Label htmlFor="ifsc">IFSC Code</Label>
                          <Input id="ifsc" placeholder="Enter IFSC code" />
                        </div>
                        <Button className="w-full">Add Bank Account</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockBankAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-semibold">{account.bankName}</h4>
                          <p className="text-sm text-gray-600">{account.accountNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {account.isPrimary && <Badge variant="default">Primary</Badge>}
                        {account.isVerified && <CheckCircle className="h-4 w-4 text-green-600" />}
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* UPI Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>UPI Accounts</span>
                  <Dialog open={showAddUPI} onOpenChange={setShowAddUPI}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add UPI
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add UPI Account</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="upi-id">UPI ID</Label>
                          <Input id="upi-id" placeholder="Enter UPI ID" />
                        </div>
                        <div>
                          <Label htmlFor="bank-name">Bank Name</Label>
                          <Input id="bank-name" placeholder="Enter bank name" />
                        </div>
                        <Button className="w-full">Add UPI Account</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUPIAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">{account.upiId}</h4>
                          <p className="text-sm text-gray-600">{account.bankName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {account.isPrimary && <Badge variant="default">Primary</Badge>}
                        {account.isVerified && <CheckCircle className="h-4 w-4 text-green-600" />}
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Digital Wallets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Digital Wallets</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Wallet
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Digital Wallet</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid gap-4">
                          {['PayPal', 'Google Pay', 'Amazon Pay'].map((wallet) => (
                            <Button
                              key={wallet}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => window.open(`https://${wallet.toLowerCase().replace(' ', '')}.com`, '_blank')}
                            >
                              <div className="flex items-center space-x-3 w-full">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  {wallet.charAt(0)}
                                </div>
                                <span>{wallet}</span>
                              </div>
                              <ChevronRight className="h-4 w-4 ml-auto" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockWalletAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                          {account.logo ? (
                            <img src={account.logo} alt={account.provider} className="w-6 h-6 object-contain" />
                          ) : (
                            <span className="text-lg font-semibold">{account.provider.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">{account.provider}</h4>
                          <p className="text-sm text-gray-600">{account.email}</p>
                          <p className="text-sm font-medium text-blue-600">
                            {account.currency} {account.balance.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {account.isPrimary && <Badge variant="default">Primary</Badge>}
                        {account.isVerified && <CheckCircle className="h-4 w-4 text-green-600" />}
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Help Center</h4>
                      <p className="text-sm text-gray-600">FAQs and guides</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Live Chat</h4>
                      <p className="text-sm text-gray-600">Chat with support</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Call Support</h4>
                      <p className="text-sm text-gray-600">+91 1800 123 4567</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="font-medium">Email Support</h4>
                      <p className="text-sm text-gray-600">support@dopayment.com</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* App Information */}
            <Card>
              <CardHeader>
                <CardTitle>App Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Version</span>
                  <span className="text-sm font-medium">1.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Build</span>
                  <span className="text-sm font-medium">2025.01.20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium">2 days ago</span>
                </div>
              </CardContent>
            </Card>

            {/* Legal */}
            <Card>
              <CardHeader>
                <CardTitle>Legal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Terms of Service</h4>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Privacy Policy</h4>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout */}
        <Card>
          <CardContent className="p-4">
            <Button 
              variant="outline" 
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};