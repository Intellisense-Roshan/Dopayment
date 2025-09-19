import React, { useState } from 'react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Lock, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Define initial state function
const createInitialProfile = (user: any) => ({
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  avatar: user?.profileImage || '',
  linkedAccounts: [
    {
      type: 'Bank' as const,
      accountNumber: '****4567',
      isVerified: true,
    },
    {
      type: 'UPI' as const,
      accountNumber: (user?.email || '').replace('@', '@upi.'),
      isVerified: true,
    },
  ],
  wallet: {
    balance: 21371.25,
    pendingPayouts: 5000,
  },
});

interface LinkedAccount {
  type: 'Bank' | 'UPI';
  accountNumber: string;
  isVerified: boolean;
}

interface Profile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  linkedAccounts: LinkedAccount[];
  wallet: {
    balance: number;
    pendingPayouts: number;
  };
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>(() => createInitialProfile(user));

  return (
    <div className="min-h-screen bg-gray-50 pb-16">


      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{profile.name}</h2>
                  <p className="text-gray-500">{profile.email}</p>
                </div>
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "default" : "outline"}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 grid gap-4">
              <div>
                <Label>Full Name</Label>
                <Input 
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input 
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>
          )}
        </Card>

        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="accounts">Linked Accounts</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Linked Accounts */}
          <TabsContent value="accounts">
            <Card>
              <div className="p-6 space-y-4">
                {profile.linkedAccounts.map((account, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {account.type === 'Bank' && <CreditCard className="h-5 w-5" />}
                      {account.type === 'UPI' && <Smartphone className="h-5 w-5" />}
                      <div>
                        <p className="font-medium">{account.type}</p>
                        <p className="text-sm text-gray-500">{account.accountNumber}</p>
                      </div>
                    </div>
                    {account.isVerified && (
                      <Badge variant="outline" className="bg-green-50">Verified</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Wallet Summary */}
          <TabsContent value="wallet">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Wallet Summary</h3>
                <div className="grid gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="text-2xl font-bold">₹{profile.wallet.balance.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Pending Payouts</p>
                    <p className="text-2xl font-bold">₹{profile.wallet.pendingPayouts.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Security Settings</p>
                      <p className="text-sm text-gray-500">2FA, Password</p>
                    </div>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-gray-500">Email, Push, SMS</p>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
