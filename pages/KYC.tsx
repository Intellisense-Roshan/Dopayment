import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  User,
  Building,
  Users,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const KYC: React.FC = () => {
  const [step, setStep] = useState<'type' | 'light' | 'full' | 'family'>('type');
  const [kycType, setKycType] = useState<'light' | 'full' | 'family'>('light');
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    panNumber: '',
    aadhaarNumber: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    childName: '',
    childDOB: '',
    childPhone: '',
    spendingLimit: 1000,
  });
  const [documents, setDocuments] = useState({
    panCard: null as File | null,
    aadhaarFront: null as File | null,
    aadhaarBack: null as File | null,
    gstCertificate: null as File | null,
  });
  const [permissions, setPermissions] = useState({
    canSendMoney: true,
    canReceiveMoney: true,
    canUseQR: false,
    canViewTransactions: true,
  });

  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentUpload = (field: keyof typeof documents, file: File) => {
    setDocuments(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = () => {
    // Simulate API call
    console.log('KYC submitted:', { kycType, formData, documents, permissions });
    navigate('/dashboard');
  };

  if (step === 'type') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Complete KYC</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Choose Verification Level</CardTitle>
              <p className="text-center text-sm text-gray-600">
                Select the verification level that suits your needs
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  kycType === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setKycType('light')}
              >
                <div className="flex items-start space-x-3">
                  <User className="h-6 w-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Light KYC</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Basic verification for personal use
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Name and date of birth</li>
                      <li>• Phone number verification</li>
                      <li>• Transaction limit: ₹10,000/month</li>
                    </ul>
                  </div>
                  <RadioGroupItem value="light" checked={kycType === 'light'} />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  kycType === 'full' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setKycType('full')}
              >
                <div className="flex items-start space-x-3">
                  <Building className="h-6 w-6 text-green-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Full KYC</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Complete verification for merchants & freelancers
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• PAN, Aadhaar, GST verification</li>
                      <li>• Business documents</li>
                      <li>• Transaction limit: ₹1,00,000/month</li>
                    </ul>
                  </div>
                  <RadioGroupItem value="full" checked={kycType === 'full'} />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  kycType === 'family' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setKycType('family')}
              >
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Family Account</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Parent-child account with spending controls
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Parent verification required</li>
                      <li>• Child spending limits</li>
                      <li>• Transaction monitoring</li>
                    </ul>
                  </div>
                  <RadioGroupItem value="family" checked={kycType === 'family'} />
                </div>
              </motion.div>

              <Button
                onClick={() => setStep(kycType)}
                className="w-full mt-6"
                disabled={!kycType}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'light') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('type')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Light KYC</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <p className="text-sm text-gray-600">
                Basic verification for personal use
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Transaction Limits</h4>
                    <p className="text-sm text-blue-700">
                      With Light KYC, you can transact up to ₹10,000 per month
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full">
                Complete Light KYC
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'full') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('type')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Full KYC</h1>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange('panNumber', e.target.value)}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                    <Input
                      id="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                      placeholder="1234 5678 9012"
                      maxLength={12}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber}
                      onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                      placeholder="22ABCDE1234F1Z5"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Document Upload</CardTitle>
                  <p className="text-sm text-gray-600">
                    Upload clear, readable images of your documents
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>PAN Card</Label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> PAN Card
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocumentUpload('panCard', file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Aadhaar Card (Front)</Label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> Aadhaar Front
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocumentUpload('aadhaarFront', file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Aadhaar Card (Back)</Label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> Aadhaar Back
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocumentUpload('aadhaarBack', file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {formData.gstNumber && (
                    <div>
                      <Label>GST Certificate</Label>
                      <div className="mt-2">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> GST Certificate
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleDocumentUpload('gstCertificate', file);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button onClick={handleSubmit} className="w-full mt-6">
            Complete Full KYC
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'family') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('type')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Family Account Setup</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Parent Information</CardTitle>
              <p className="text-sm text-gray-600">
                Complete your verification first
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Your Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Your Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="panNumber">Your PAN Number</Label>
                <Input
                  id="panNumber"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value)}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Child Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="childName">Child's Name</Label>
                <Input
                  id="childName"
                  value={formData.childName}
                  onChange={(e) => handleInputChange('childName', e.target.value)}
                  placeholder="Enter child's name"
                />
              </div>

              <div>
                <Label htmlFor="childDOB">Child's Date of Birth</Label>
                <Input
                  id="childDOB"
                  type="date"
                  value={formData.childDOB}
                  onChange={(e) => handleInputChange('childDOB', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="childPhone">Child's Phone Number</Label>
                <Input
                  id="childPhone"
                  value={formData.childPhone}
                  onChange={(e) => handleInputChange('childPhone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <Label htmlFor="spendingLimit">Monthly Spending Limit (₹)</Label>
                <Input
                  id="spendingLimit"
                  type="number"
                  value={formData.spendingLimit}
                  onChange={(e) => handleInputChange('spendingLimit', e.target.value)}
                  placeholder="1000"
                />
              </div>

              <div className="space-y-3">
                <Label>Child Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canSendMoney"
                      checked={permissions.canSendMoney}
                      onCheckedChange={(checked) =>
                        setPermissions(prev => ({ ...prev, canSendMoney: !!checked }))
                      }
                    />
                    <Label htmlFor="canSendMoney">Can send money</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canReceiveMoney"
                      checked={permissions.canReceiveMoney}
                      onCheckedChange={(checked) =>
                        setPermissions(prev => ({ ...prev, canReceiveMoney: !!checked }))
                      }
                    />
                    <Label htmlFor="canReceiveMoney">Can receive money</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canUseQR"
                      checked={permissions.canUseQR}
                      onCheckedChange={(checked) =>
                        setPermissions(prev => ({ ...prev, canUseQR: !!checked }))
                      }
                    />
                    <Label htmlFor="canUseQR">Can use QR payments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canViewTransactions"
                      checked={permissions.canViewTransactions}
                      onCheckedChange={(checked) =>
                        setPermissions(prev => ({ ...prev, canViewTransactions: !!checked }))
                      }
                    />
                    <Label htmlFor="canViewTransactions">Can view transaction history</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSubmit} className="w-full mt-6">
            Create Family Account
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

