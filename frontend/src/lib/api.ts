import axios from 'axios';
import { getCookie } from 'cookies-next';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '/backend-api';
  }
  return 'https://brunomart-production.up.railway.app/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// INTERCEPTOR REQUEST
// ==========================================
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      console.log('🍪 Token:', token);

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// INTERCEPTOR RESPONSE
// ==========================================
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);