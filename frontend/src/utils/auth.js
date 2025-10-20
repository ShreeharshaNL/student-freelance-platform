//utils/auth.js
// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Token management utilities
export const tokenUtils = {
  // Store token in localStorage
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  // Check if token exists
  hasToken: () => {
    return !!localStorage.getItem('authToken');
  },

  // Parse JWT token to get user data
  parseToken: (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    try {
      const payload = tokenUtils.parseToken(token);
      if (!payload || !payload.exp) return true;
      
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch (error) {
      return true;
    }
  }
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = tokenUtils.getToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Login user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Verify token
  verifyToken: async () => {
    return apiRequest('/auth/verify-token', {
      method: 'POST'
    });
  },

  // Refresh token
  refreshToken: async () => {
    return apiRequest('/auth/refresh-token', {
      method: 'POST'
    });
  },

  // Logout (client-side token removal)
  logout: () => {
    tokenUtils.removeToken();
    // Clear user data from localStorage if any
    localStorage.removeItem('userData');
  }
};

// Auto-refresh token mechanism
let refreshTimeout;

export const setupTokenRefresh = (onTokenExpired) => {
  const token = tokenUtils.getToken();
  
  if (!token || tokenUtils.isTokenExpired(token)) {
    onTokenExpired?.();
    return;
  }

  const payload = tokenUtils.parseToken(token);
  if (!payload?.exp) return;

  // Refresh token 5 minutes before expiration
  const refreshTime = (payload.exp * 1000) - Date.now() - (5 * 60 * 1000);
  
  if (refreshTime > 0) {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(async () => {
      try {
        const response = await authAPI.refreshToken();
        if (response.success && response.data.token) {
          tokenUtils.setToken(response.data.token);
          setupTokenRefresh(onTokenExpired); // Setup next refresh
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        onTokenExpired?.();
      }
    }, refreshTime);
  } else {
    // Token is already expired or about to expire, trigger refresh immediately
    onTokenExpired?.();
  }
};

// Clear token refresh timeout
export const clearTokenRefresh = () => {
  clearTimeout(refreshTimeout);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = tokenUtils.getToken();
  return token && !tokenUtils.isTokenExpired(token);
};

// Get current user data from token
export const getCurrentUser = () => {
  const token = tokenUtils.getToken();
  if (!token || tokenUtils.isTokenExpired(token)) {
    return null;
  }
  
  const payload = tokenUtils.parseToken(token);
  return payload ? {
    id: payload.id,
    email: payload.email,
    role: payload.role
  } : null;
};