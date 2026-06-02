import axios from 'axios';
import { getCookie } from 'cookies-next';

const getBaseURL = () => {
  // Jika di lingkungan browser, gunakan rewrites /backend-api atau URL Env
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '/backend-api';
  }
  // Jika di lingkungan server (SSR Vercel), tembak URL Railway absolut
  return 'https://brunomart-production.up.railway.app/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor request
api.interceptors.request.use(
  (config) => {
    // Jalankan getCookie HANYA jika berada di browser (client-side)
    if (typeof window !== 'undefined') {
      const token = getCookie('token'); 
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);