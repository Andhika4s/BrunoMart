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
// INTERCEPTOR REQUEST
// ==========================================
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

// ==========================================
// INTERCEPTOR RESPONSE (PERBAIKAN SINKRONISASI TOKEN)
// ==========================================
api.interceptors.response.use(
  (response) => {
    // Ambil detail URL endpoint yang baru saja diakses oleh request ini
    const requestUrl = response.config.url || '';

    // KONDISI KHUSUS: Hanya periksa token secara ketat jika endpointnya adalah LOGIN
    if (requestUrl.includes('/auth/login')) {
      const token = response.data.token || response.data.access_token || response.data.accessToken;
      
      if (!token) {
        throw new Error('Token tidak ditemukan dari response server backend!');
      }
    }

    // Jika endpoint lain (seperti /auth/register, /products, dll), loloskan secara normal
    return response;
  },
  (error) => {
    // Teruskan error response (seperti 400, 401, 409) agar dibaca langsung oleh onError di useMutation Anda
    return Promise.reject(error);
  }
);