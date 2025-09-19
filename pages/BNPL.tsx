import React from 'react';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// No settings needed

export const BNPLPage: React.FC = () => {
  // Mock data - replace with actual data from your API
  const totalBNPL = 50000;
  const activePlans = 3;
  const totalRepaid = 15000;
  const pendingAmount = 35000;

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="loans">Active Plans</TabsTrigger>
            <TabsTrigger value="repayments">Repayments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <Label className="text-sm text-gray-500">Total BNPL Amount</Label>
                <p className="text-2xl font-bold mt-1">₹{totalBNPL.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                <Label className="text-sm text-gray-500">Active Plans</Label>
                <p className="text-2xl font-bold mt-1">{activePlans}</p>
              </Card>
              <Card className="p-4">
                <Label className="text-sm text-gray-500">Total Repaid</Label>
                <p className="text-2xl font-bold text-green-600 mt-1">₹{totalRepaid.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                <Label className="text-sm text-gray-500">Pending Amount</Label>
                <p className="text-2xl font-bold text-blue-600 mt-1">₹{pendingAmount.toLocaleString()}</p>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="mb-6">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Recent Activity</h3>
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Available Plans</h3>
                <div className="space-y-4">
                  <Button className="w-full" variant="outline">Check Eligibility</Button>
                  <Button className="w-full">Apply for BNPL</Button>
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Next Repayments</h3>
                <p className="text-gray-500 text-center py-4">No upcoming repayments</p>
              </Card>
            </div>
          </TabsContent>

          {/* Active Plans Tab */}
          <TabsContent value="loans">
            <Card className="p-4">
              <div className="text-center py-8">
                <p className="text-gray-500">No active BNPL plans</p>
                <Button className="mt-4">Apply for BNPL</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Repayments Tab */}
          <TabsContent value="repayments">
            <Card className="p-4">
              <div className="text-center py-8">
                <p className="text-gray-500">No repayment history available</p>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">BNPL Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label>Notifications</Label>
                  <p className="text-sm text-gray-500">Enable or disable BNPL related notifications</p>
                </div>
                <div>
                  <Label>Auto Repayment</Label>
                  <p className="text-sm text-gray-500">Configure automatic repayment from your linked account</p>
                </div>
                <div>
                  <Label>Statement Preferences</Label>
                  <p className="text-sm text-gray-500">Set your statement delivery preferences</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer space for bottom navigation */}
      <div className="h-16" />
    </div>
  );
};