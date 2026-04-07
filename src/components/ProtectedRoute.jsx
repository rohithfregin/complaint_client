import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protect routes — redirect to /login if not logged in
// Optionally require a specific role ('admin' | 'student')
const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard if wrong role
        const fallback = user.role === 'admin' ? '/admin' : '/dashboard';
        return <Navigate to={fallback} replace />;
    }

    return children;
};

export default ProtectedRoute;
