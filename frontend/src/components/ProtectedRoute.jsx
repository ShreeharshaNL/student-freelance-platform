//ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    if (user?.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (user?.role === 'client') {
      return <Navigate to="/client/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has the required role
  return children;
};

// Student-only route wrapper
export const StudentRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      {children}
    </ProtectedRoute>
  );
};

// Client-only route wrapper
export const ClientRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      {children}
    </ProtectedRoute>
  );
};

// Route accessible by both students and clients
export const AuthenticatedRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['student', 'client']}>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;