// AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authAPI, tokenUtils, setupTokenRefresh, clearTokenRefresh } from "../utils/authAPI";

// ---------- helpers ----------
const applyAxiosAuthHeader = (token) => {
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axios.defaults.headers.common["Authorization"];
};

// ---------- context ----------
const AuthContext = createContext();
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);        // <-- expose token to consumers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // init on mount
  useEffect(() => {
    initializeAuth();
    return () => clearTokenRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep axios header in sync
  useEffect(() => {
    applyAxiosAuthHeader(token);
  }, [token]);

  // ---------- init ----------
  const initializeAuth = async () => {
    try {
      setLoading(true);
      const existing = tokenUtils.getToken();

      if (existing && !tokenUtils.isTokenExpired(existing)) {
        const payload = tokenUtils.parseToken(existing);
        if (payload && payload.id) {
          setUser({
            id: payload.id,
            email: payload.email,
            role: payload.role,
            name: payload.name,
          });
          setToken(existing);
          applyAxiosAuthHeader(existing);
          setupTokenRefresh(handleTokenExpired);
        } else {
          tokenUtils.removeToken();
          setUser(null);
          setToken(null);
        }
      } else {
        tokenUtils.removeToken();
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error("Auth init error:", err);
      tokenUtils.removeToken();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------- token expiry ----------
  const handleTokenExpired = () => {
    tokenUtils.removeToken();
    setUser(null);
    setToken(null);
    applyAxiosAuthHeader(null);
    navigate("/login");
  };

  // ---------- login ----------
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login({ email, password });
      if (!response?.success) throw new Error(response?.error || "Login failed");

      const { token: newToken, user: userData } = response.data;

      tokenUtils.setToken(newToken);
      setToken(newToken);
      applyAxiosAuthHeader(newToken);

      setUser(userData);
      setupTokenRefresh(handleTokenExpired);

      // role-based landing
      if (userData.role === "student") navigate("/student/dashboard");
      else if (userData.role === "client") navigate("/client/dashboard");
      else navigate("/");

      return { success: true };
    } catch (err) {
      const message = err?.message || "Invalid email or password";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ---------- register ----------
  const register = async (userPayload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(userPayload);
      if (!response?.success) throw new Error(response?.error || "Registration failed");

      const { token: newToken, user: registeredUser } = response.data;

      tokenUtils.setToken(newToken);
      setToken(newToken);
      applyAxiosAuthHeader(newToken);

      setUser(registeredUser);
      setupTokenRefresh(handleTokenExpired);

      if (registeredUser.role === "student") navigate("/student/dashboard");
      else if (registeredUser.role === "client") navigate("/client/dashboard");
      else navigate("/");

      return { success: true };
    } catch (err) {
      const message = err?.message || "Registration failed. Please try again.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ---------- logout ----------
  const logout = () => {
    tokenUtils.removeToken();
    clearTokenRefresh();
    setUser(null);
    setToken(null);
    applyAxiosAuthHeader(null);
    navigate("/");
  };

  // ---------- convenience ----------
  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    token,                // <-- now available to components (e.g., ClientProfile)
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
