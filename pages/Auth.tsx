import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Smartphone, 
  Mail, 
  Eye, 
  EyeOff,
  Chrome,
  Apple,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Auth: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'auth' | 'otp' | 'kyc'>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setStep('kyc');
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('auth')}
              className="w-fit -ml-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-center">Verify Phone Number</CardTitle>
            <p className="text-center text-sm text-gray-600">
              Enter the 6-digit code sent to<br />
              <span className="font-medium">{phone}</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-bold"
                />
              ))}
            </div>
            
            <Button
              onClick={handleOtpSubmit}
              disabled={otp.some(digit => !digit)}
              className="w-full"
            >
              Verify OTP
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive code?{' '}
                <Button variant="link" className="p-0 h-auto">
                  Resend OTP
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'kyc') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Complete Your Profile</CardTitle>
            <p className="text-center text-sm text-gray-600">
              Help us verify your identity for secure transactions
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullname">Full Name</Label>
                <Input id="fullname" placeholder="Enter your full name" />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" />
              </div>
              <div>
                <Label htmlFor="pan">PAN Number (Optional)</Label>
                <Input id="pan" placeholder="ABCDE1234F" />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Complete Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Skip for Now
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-blue-600">
            DoPayment
          </CardTitle>
          <p className="text-center text-gray-600">
            Secure payments made simple
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email or Phone</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter email or phone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Forgot Password?
                  </Button>
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                      <span className="text-sm">+91</span>
                    </div>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Create Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a strong password"
                  />
                </div>
                <Button
                  onClick={() => setStep('otp')}
                  className="w-full"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Continue with OTP
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12">
                <Chrome className="h-4 w-4 mr-2" />
                Google
              </Button>
              <Button variant="outline" className="h-12">
                <Apple className="h-4 w-4 mr-2" />
                Apple
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you agree to our{' '}
            <Button variant="link" className="p-0 h-auto text-xs">
              Terms of Service
            </Button>{' '}
            and{' '}
            <Button variant="link" className="p-0 h-auto text-xs">
              Privacy Policy
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};