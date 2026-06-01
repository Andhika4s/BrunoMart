import axios from 'axios';
import { getCookie } from 'cookies-next'; // 👈 1. Impor getCookie dari cookies-next

export const api = axios.create({
  // Arahkan langsung ke port backend NestJS dan sertakan prefix '/api'
  baseURL: 'http://localhost:5000/api', 
  withCredentials: true, // Tetap pertahankan ini jika backend menggunakannya
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan Token JWT dari cookie di setiap request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // 👈 2. Ganti localStorage dengan getCookie sesuai key yang kamu set saat login
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