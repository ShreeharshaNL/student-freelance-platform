// Configuration that works at runtime
export const getApiUrl = () => {
  // Check build-time environment variables first
  if (import.meta.env.VITE_API_URL) {
    console.log('Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  if (import.meta.env.NEXT_PUBLIC_API_BASE_URL) {
    console.log('Using NEXT_PUBLIC_API_BASE_URL:', import.meta.env.NEXT_PUBLIC_API_BASE_URL);
    return import.meta.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Fallback to detecting environment
  const isDevelopment = import.meta.env.DEV || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1';
  
  const apiUrl = isDevelopment 
    ? 'http://localhost:5000/api'
    : 'https://student-freelance-platform-2.onrender.com/api';
  
  console.log('Using detected environment URL:', apiUrl, '(isDev:', isDevelopment, ')');
  return apiUrl;
};

export const API_BASE_URL = getApiUrl();
