// src/utils/api.js
import axios from "axios";
import { tokenUtils } from "./auth";

// ✅ Use Vercel + local env variables
const baseURL =
  import.meta.env.VITE_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL || // in case you use Next.js later
  "http://localhost:5000"; // fallback for local testing

const api = axios.create({
  baseURL,
  withCredentials: true, // allow cookies / auth headers if needed
});

// Automatically attach JWT token to every request
api.interceptors.request.use((req) => {
  const token = tokenUtils.getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;
