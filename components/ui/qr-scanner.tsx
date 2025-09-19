import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  CameraOff, 
  Flashlight, 
  FlashlightOff, 
  RotateCcw,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, isOpen }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        setHasPermission(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const toggleFlash = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack && videoTrack.getCapabilities().torch) {
        videoTrack.applyConstraints({
          advanced: [{ torch: !flashOn }]
        });
        setFlashOn(!flashOn);
      }
    }
  };

  const handleScan = (data: string) => {
    setScanResult(data);
    setIsScanning(false);
    onScan(data);
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
      >
        <div className="relative w-full h-full">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
              <h2 className="text-white font-semibold">Scan QR Code</h2>
              <div className="w-10" />
            </div>
          </div>

          {/* Camera View */}
          <div className="relative w-full h-full">
            {hasPermission === false ? (
              <div className="flex flex-col items-center justify-center h-full text-white p-8">
                <AlertCircle className="h-16 w-16 mb-4 text-red-400" />
                <h3 className="text-xl font-semibold mb-2">Camera Access Denied</h3>
                <p className="text-center text-gray-300 mb-6">
                  Please allow camera access to scan QR codes
                </p>
                <Button onClick={startCamera} variant="outline" className="text-white border-white">
                  Try Again
                </Button>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-white p-8">
                <AlertCircle className="h-16 w-16 mb-4 text-red-400" />
                <h3 className="text-xl font-semibold mb-2">Camera Error</h3>
                <p className="text-center text-gray-300 mb-6">{error}</p>
                <Button onClick={resetScanner} variant="outline" className="text-white border-white">
                  Retry
                </Button>
              </div>
            ) : scanResult ? (
              <div className="flex flex-col items-center justify-center h-full text-white p-8">
                <CheckCircle className="h-16 w-16 mb-4 text-green-400" />
                <h3 className="text-xl font-semibold mb-2">QR Code Scanned!</h3>
                <p className="text-center text-gray-300 mb-6 break-all">
                  {scanResult}
                </p>
                <div className="flex space-x-4">
                  <Button onClick={resetScanner} variant="outline" className="text-white border-white">
                    Scan Another
                  </Button>
                  <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Scanning Frame */}
                    <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
                    </div>
                    
                    {/* Scanning Line */}
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-1 bg-blue-400 rounded-full"
                      animate={{ y: [0, 256, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-20 left-0 right-0 text-center text-white px-8">
                  <p className="text-lg font-medium mb-2">Position QR code within the frame</p>
                  <p className="text-sm text-gray-300">Make sure the QR code is clearly visible</p>
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          {hasPermission && !scanResult && !error && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-8 p-6">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={toggleFlash}
                  className="text-white hover:bg-white/20"
                >
                  {flashOn ? <FlashlightOff className="h-6 w-6" /> : <Flashlight className="h-6 w-6" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={resetScanner}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Mock QR Code Scanner for demo purposes
export const MockQRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, isOpen }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleMockScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const mockQRData = "upi://pay?pa=merchant@paytm&pn=Test%20Merchant&am=100&cu=INR&tr=123456789";
      onScan(mockQRData);
      setIsScanning(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      <div className="relative w-full h-full">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-white font-semibold">Scan QR Code</h2>
            <div className="w-10" />
          </div>
        </div>

        {/* Mock Camera View */}
        <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <Camera className="h-24 w-24 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Mock QR Scanner</h3>
              <p className="text-gray-300 mb-6">This is a demo scanner</p>
              
              <Button
                onClick={handleMockScan}
                disabled={isScanning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isScanning ? 'Scanning...' : 'Scan Mock QR Code'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

