import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Student pages
import StudentDashboard from './pages/StudentDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import ComplaintStatus from './pages/ComplaintStatus';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import ManageComplaints from './pages/ManageComplaints';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Toast notifications — top-right, dark themed */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#ffffff',
              color: '#4A4A4A',
              border: '1px solid #CBCBCB',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#6D8196', secondary: '#FFFFE3' },
            },
            error: {
              iconTheme: { primary: '#4A4A4A', secondary: '#FFFFE3' },
            },
          }}
        />

        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Student routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit"
            element={
              <ProtectedRoute requiredRole="student">
                <SubmitComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-complaints"
            element={
              <ProtectedRoute requiredRole="student">
                <ComplaintStatus />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageComplaints />
              </ProtectedRoute>
            }
          />

          {/* Catch-all: redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
