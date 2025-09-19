import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';

// Pages
import { Dashboard } from '@/pages/Dashboard';
import { Payments } from '@/pages/Payments';
import { QRPayments } from '@/pages/QRPayments';
import { Transactions } from '@/pages/Transactions';
import { Settings } from '@/pages/Settings';
import { MerchantDashboard } from '@/pages/MerchantDashboard';
import { Insights } from '@/pages/Insights';
import { Auth } from '@/pages/Auth';
import { KYC } from '@/pages/KYC';
import { BNPLPage } from '@/pages/BNPL';
import { ProfilePage } from '@/pages/Profile';
import { WalletPage } from '@/pages/Wallet';

// No local layout definition needed anymore - we're importing it

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

// Public route wrapper (redirects to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />
      <Route
        path="/kyc"
        element={
          <ProtectedRoute>
            <KYC />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <WalletPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qr"
        element={
          <ProtectedRoute>
            <QRPayments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant"
        element={
          <ProtectedRoute>
            <MerchantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <Insights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bnpl"
        element={
          <ProtectedRoute>
            <BNPLPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="font-sans antialiased">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;