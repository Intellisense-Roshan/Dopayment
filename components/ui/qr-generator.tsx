import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  CheckCircle,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { QRCode } from '@/types';

interface QRGeneratorProps {
  upiId: string;
  onAmountChange?: (amount: number | undefined) => void;
  onDescriptionChange?: (description: string) => void;
  className?: string;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  upiId,
  onAmountChange,
  onDescriptionChange,
  className
}) => {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [showAmount, setShowAmount] = useState(true);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate UPI URL
    const upiUrl = generateUPIUrl();
    
    // Create a simple QR code pattern (mock implementation)
    const size = 200;
    const cellSize = 8;
    const cells = size / cellSize;
    
    // Generate a simple pattern based on UPI URL
    const pattern = generateQRPattern(upiUrl, cells);
    
    // Draw QR code
    ctx.fillStyle = '#000000';
    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        if (pattern[row * cells + col]) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }

    // Add border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
  };

  const generateQRPattern = (text: string, cells: number): boolean[] => {
    // Simple pattern generation based on text hash
    const pattern = new Array(cells * cells).fill(false);
    let hash = 0;
    
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
    }
    
    // Use hash to generate pattern
    for (let i = 0; i < cells * cells; i++) {
      pattern[i] = (hash + i) % 3 === 0;
    }
    
    return pattern;
  };

  const generateUPIUrl = (): string => {
    const params = new URLSearchParams();
    params.set('pa', upiId);
    params.set('pn', 'DoPayment User');
    if (amount) {
      params.set('am', amount.toString());
    }
    params.set('cu', 'INR');
    if (description) {
      params.set('tr', description);
    }
    
    return `upi://pay?${params.toString()}`;
  };

  const handleAmountChange = (value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setAmount(numValue);
    onAmountChange?.(numValue);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    onDescriptionChange?.(value);
  };

  const copyUPIUrl = async () => {
    const upiUrl = generateUPIUrl();
    try {
      await navigator.clipboard.writeText(upiUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareQR = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        });
      });

      if (navigator.share && navigator.canShare({ files: [new File([blob], 'qr-code.png')] })) {
        await navigator.share({
          title: 'My QR Code',
          text: 'Scan this QR code to send me money',
          files: [new File([blob], 'qr-code.png')]
        });
      } else {
        // Fallback to copy
        copyUPIUrl();
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  React.useEffect(() => {
    generateQRCode();
  }, [amount, description, upiId]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="h-5 w-5" />
          <span>My QR Code</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={200}
              height={200}
              className="border-2 border-gray-200 rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                <QrCode className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* UPI ID Display */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">UPI ID</p>
          <div className="flex items-center justify-center space-x-2">
            <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
              {upiId}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyUPIUrl}
              className="h-8 w-8 p-0"
            >
              {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount">Amount (Optional)</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAmount(!showAmount)}
              className="h-6 w-6 p-0"
            >
              {showAmount ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount || ''}
            onChange={(e) => handleAmountChange(e.target.value)}
            disabled={!showAmount}
          />
          {amount && (
            <Badge variant="secondary" className="w-fit">
              {formatCurrency(amount)}
            </Badge>
          )}
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={downloadQR}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            onClick={shareQR}
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Share this QR code with others</li>
            <li>• They can scan it with any UPI app</li>
            <li>• Money will be sent to your UPI ID</li>
            <li>• You'll receive instant notifications</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// QR Code List Component
interface QRCodeListProps {
  qrCodes: QRCode[];
  onSelect: (qrCode: QRCode) => void;
  onCreateNew: () => void;
}

export const QRCodeList: React.FC<QRCodeListProps> = ({
  qrCodes,
  onSelect,
  onCreateNew
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My QR Codes</h3>
        <Button onClick={onCreateNew} size="sm">
          <QrCode className="h-4 w-4 mr-2" />
          New QR
        </Button>
      </div>

      <div className="space-y-3">
        {qrCodes.map((qrCode) => (
          <motion.div
            key={qrCode.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelect(qrCode)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{qrCode.description || 'Personal QR Code'}</h4>
                    <p className="text-sm text-gray-600">{qrCode.upiId}</p>
                    {qrCode.amount && (
                      <Badge variant="secondary" className="mt-1">
                        {formatCurrency(qrCode.amount)}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={qrCode.isActive ? 'default' : 'secondary'}>
                      {qrCode.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {qrCode.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

