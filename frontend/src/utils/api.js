// src/utils/api.js
import axios from "axios";
import { tokenUtils } from "./auth";

// Base URL configuration
const baseURL =
  import.meta.env.VITE_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://student-freelance-platform-2.onrender.com");

console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL,
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
