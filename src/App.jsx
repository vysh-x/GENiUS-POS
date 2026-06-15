import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import LicenseVerify from './pages/LicenseVerify';
import Login from './pages/Login';
import Landing from './pages/Landing';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, license, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!license) {
    return <Navigate to="/license" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const LicenseRoute = ({ children }) => {
  const { license, loading } = useAuth();

  if (loading) return null;

  if (license) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route
              path="/license"
              element={
                <LicenseRoute>
                  <LicenseVerify />
                </LicenseRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Landing />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
