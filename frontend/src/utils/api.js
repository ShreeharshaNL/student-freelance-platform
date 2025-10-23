// src/utils/api.js
import axios from "axios";
import { tokenUtils } from "./auth"; // <-- same folder as your other utils

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: false,
});

// Attach Authorization header on every request using the token your app manages
api.interceptors.request.use((req) => {
  const token = tokenUtils.getToken(); // unified source of truth
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default api;
