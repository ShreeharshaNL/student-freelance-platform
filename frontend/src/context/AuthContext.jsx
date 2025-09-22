import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  authAPI, 
  tokenUtils, 
  isAuthenticated, 
  getCurrentUser,
  setupTokenRefresh,
  clearTokenRefresh
} from '../utils/auth';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
    
    // Cleanup on unmount
    return () => {
      clearTokenRefresh();
    };
  }, []);

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      if (isAuthenticated()) {
        const userData = getCurrentUser();
        
        // Verify token with backend
        const response = await authAPI.verifyToken();
        
        if (response.success && response.data.user) {
          const fullUserData = response.data.user;
          setUser(fullUserData);
          
          // Set up token refresh
          setupTokenRefresh(() => {
            handleTokenExpired();
          });
        } else {
          // Token is invalid
          tokenUtils.removeToken();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      tokenUtils.removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle token expiration
  const handleTokenExpired = () => {
    tokenUtils.removeToken();
    setUser(null);
    navigate('/login');
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data.token) {
        // Store token
        tokenUtils.setToken(response.data.token);
        
        // Set user data
        const userData = response.data.user;
        setUser(userData);
        
        // Set up token refresh
        setupTokenRefresh(() => {
          handleTokenExpired();
        });
        
        // Navigate based on role
        if (userData.role === 'student') {
          navigate('/student/dashboard');
        } else if (userData.role === 'client') {
          navigate('/client/dashboard');
        } else {
          navigate('/');
        }
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Invalid email or password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.register(userData);
      
      if (response.success && response.data.token) {
        // Store token
        tokenUtils.setToken(response.data.token);
        
        // Set user data
        const registeredUserData = response.data.user;
        setUser(registeredUserData);
        
        // Set up token refresh
        setupTokenRefresh(() => {
          handleTokenExpired();
        });
        
        // Navigate based on role
        if (registeredUserData.role === 'student') {
          navigate('/student/dashboard');
        } else if (registeredUserData.role === 'client') {
          navigate('/client/dashboard');
        } else {
          navigate('/');
        }
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    clearTokenRefresh();
    setUser(null);
    navigate('/');
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};