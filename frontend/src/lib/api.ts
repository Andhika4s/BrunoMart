import axios from 'axios';
import { getCookie } from 'cookies-next';

// Mendapatkan base URL dinamis (bisa mendeteksi mode server-side atau browser)
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Di browser: arahkan ke /backend-api (memanfaatkan Next.js Rewrites)
    return process.env.NEXT_PUBLIC_API_URL || '/backend-api';
  }
  // Di server-side (jika ada SSR/Server Component): tembak langsung ke URL absolutnya
  return process.env.NODE_ENV === 'production'
    ? 'https://brunomart-production.up.railway.app/api'
    : 'http://localhost:5000/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan Token JWT dari cookie di setiap request
api.interceptors.request.use(
  (config) => {
    const token = getCookie('token'); 
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);