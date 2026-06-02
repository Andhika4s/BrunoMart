/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Ketika FE menembak rute ini...
        source: '/backend-api/:path*',
        // ...Vercel akan meneruskannya secara diam-diam ke Railway tanpa mengubah URL di browser
        destination: process.env.NODE_ENV === 'production'
          ? 'https://brunomart-production.up.railway.app/api/:path*'
          : 'http://localhost:5000/api/:path*',
      },
      {
        // Bypass rute static assets untuk gambar uploads produk agar aman dari CORS
        source: '/uploads/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://brunomart-production.up.railway.app/uploads/:path*'
          : 'http://localhost:5000/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;