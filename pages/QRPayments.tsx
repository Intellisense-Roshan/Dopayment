import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  QrCode, 
  Download, 
  Share2, 
  Copy,
  Check,
  Scan,
  Image as ImageIcon,
  History,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { QRGenerator, QRCodeList } from '@/components/ui/qr-generator';
import { MockQRScanner } from '@/components/ui/qr-scanner';
import { mockQRCodes } from '@/data/mockData';
import { QRCode as QRCodeType } from '@/types';
import { motion } from 'framer-motion';

export const QRPayments: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedQR, setSelectedQR] = useState<QRCodeType | null>(null);
  const [qrCodes, setQRCodes] = useState<QRCodeType[]>(mockQRCodes);
  const [scannedData, setScannedData] = useState<string | null>(null);
  
  const handleCopyUPI = () => {
    navigator.clipboard.writeText(`${user?.phone}@dopay`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareQR = () => {
    // Share QR code functionality
    if (navigator.share) {
      navigator.share({
        title: 'My Payment QR Code',
        text: 'Pay me using this QR code',
        url: window.location.href,
      });
    }
  };

  const handleScan = (data: string) => {
    setScannedData(data);
    setShowScanner(false);
    // Process scanned QR data
    console.log('Scanned QR data:', data);
  };

  const handleCreateNewQR = () => {
    const newQR: QRCodeType = {
      id: Date.now().toString(),
      upiId: `${user?.phone}@dopay`,
      amount: undefined,
      description: 'New QR Code',
      isActive: true,
      createdAt: new Date(),
    };
    setQRCodes(prev => [newQR, ...prev]);
    setSelectedQR(newQR);
  };

  const handleQRSelect = (qrCode: QRCodeType) => {
    setSelectedQR(qrCode);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      
      <div className="p-4">
        <Tabs defaultValue="scan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scan">Scan</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6">
            {/* QR Scanner */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Scan QR Code to Pay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center cursor-pointer"
                    onClick={() => setShowScanner(true)}
                  >
                    <Camera className="h-12 w-12 text-white" />
                  </motion.div>
                  <p className="text-gray-600 mb-4">Tap to scan QR code</p>
                  <Button 
                    onClick={() => setShowScanner(true)}
                    className="w-full"
                    size="lg"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Open Camera
                  </Button>
                </div>

                {scannedData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <h4 className="font-semibold text-green-900 mb-2">QR Code Scanned!</h4>
                    <p className="text-sm text-green-800 break-all">{scannedData}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setScannedData(null)}
                    >
                      Clear
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Manual UPI Entry */}
            <Card>
              <CardHeader>
                <CardTitle>Or Enter UPI ID Manually</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input
                    id="upi-id"
                    placeholder="example@upi"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pay-amount">Amount (₹)</Label>
                  <Input
                    id="pay-amount"
                    type="number"
                    placeholder="Enter amount"
                    className="mt-1"
                  />
                </div>
                <Button className="w-full">Pay Now</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            {selectedQR ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <QRGenerator
                  upiId={selectedQR.upiId}
                  onAmountChange={(amount) => {
                    setSelectedQR(prev => prev ? { ...prev, amount } : null);
                  }}
                  onDescriptionChange={(description) => {
                    setSelectedQR(prev => prev ? { ...prev, description } : null);
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => setSelectedQR(null)}
                  className="w-full mt-4"
                >
                  Back to QR List
                </Button>
              </motion.div>
            ) : (
              <QRCodeList
                qrCodes={qrCodes}
                onSelect={handleQRSelect}
                onCreateNew={handleCreateNewQR}
              />
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>QR Transaction History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qrCodes.map((qrCode) => (
                    <motion.div
                      key={qrCode.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <QrCode className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{qrCode.description}</h4>
                        <p className="text-xs text-gray-600">{qrCode.upiId}</p>
                        {qrCode.amount && (
                          <p className="text-xs font-medium text-green-600">
                            {qrCode.amount > 0 ? `+₹${qrCode.amount}` : `-₹${Math.abs(qrCode.amount)}`}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {qrCode.createdAt.toLocaleDateString()}
                        </p>
                        <div className={`w-2 h-2 rounded-full mt-1 ${
                          qrCode.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Mock QR Scanner */}
        <MockQRScanner
          isOpen={showScanner}
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      </div>
    </div>
  );
};