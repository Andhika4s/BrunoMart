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

// ==========================================
// INTERCEPTOR RESPONSE
// ==========================================
api.interceptors.response.use(
  (response) => {
    return response; // Loloskan semua response normal
  },
  (error) => {
    return Promise.reject(error); // Teruskan error ke onError mutation
  }
);