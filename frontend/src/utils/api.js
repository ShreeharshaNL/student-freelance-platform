// api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // backend URL
});

// Add token automatically if stored in localStorage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('authToken'); // ← CHANGED from 'token' to 'authToken'
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;