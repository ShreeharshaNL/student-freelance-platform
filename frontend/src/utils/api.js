// src/utils/api.js
import axios from "axios";
import { tokenUtils } from "./authAPI.js";
import { API_BASE_URL } from "../config.js";

// API_BASE_URL already includes /api, so use it directly
console.log('API utility initialized with baseURL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout for mobile networks
  headers: {
    'Content-Type': 'application/json',
  }
});

// Attach JWT token automatically
api.interceptors.request.use(
  (req) => {
    const token = tokenUtils.getToken();
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', req.method, req.url);
    return req;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export default api;
