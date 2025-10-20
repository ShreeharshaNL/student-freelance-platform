//AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, tokenUtils, setupTokenRefresh, clearTokenRefresh } from "../utils/auth";

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
    return () => clearTokenRefresh();
  }, []);

// Initialize authentication
const initializeAuth = async () => {
  try {
    setLoading(true);
    const token = tokenUtils.getToken();
    
    if (token && !tokenUtils.isTokenExpired(token)) {
      // Token exists and is valid, parse user data from token
      const userData = tokenUtils.parseToken(token);
      
      if (userData && userData.id) {
        setUser({
          id: userData.id,
          email: userData.email,
          role: userData.role,
          name: userData.name // if your token has this
        });
        setupTokenRefresh(handleTokenExpired);
      } else {
        // Token is invalid, clear it
        tokenUtils.removeToken();
        setUser(null);
      }
    } else {
      // No token or expired token
      tokenUtils.removeToken();
      setUser(null);
    }
  } catch (err) {
    console.error("Auth init error:", err);
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
    navigate("/login");
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login({ email, password });

      if (!response.success) throw new Error(response.error || "Login failed");

      const userData = response.data.user;
      tokenUtils.setToken(response.data.token);
      setUser(userData);
      setupTokenRefresh(handleTokenExpired);

      // Navigate based on role
      if (userData.role === "student") navigate("/student/dashboard");
      else if (userData.role === "client") navigate("/client/dashboard");
      else navigate("/");

      return { success: true };
    } catch (err) {
      const message = err.message || "Invalid email or password";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(userData);

      if (!response.success) throw new Error(response.error || "Registration failed");

      const registeredUser = response.data.user;
      tokenUtils.setToken(response.data.token);
      setUser(registeredUser);
      setupTokenRefresh(handleTokenExpired);

      // Navigate based on role
      if (registeredUser.role === "student") navigate("/student/dashboard");
      else if (registeredUser.role === "client") navigate("/client/dashboard");
      else navigate("/");

      return { success: true };
    } catch (err) {
      const message = err.message || "Registration failed. Please try again.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    tokenUtils.removeToken();
    clearTokenRefresh();
    setUser(null);
    navigate("/");
  };

  // Update user
  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
