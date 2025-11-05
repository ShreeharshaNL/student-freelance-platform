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

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach JWT token automatically
api.interceptors.request.use((req) => {
  const token = tokenUtils.getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;
