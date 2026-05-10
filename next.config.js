/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // 1. Cấu hình bỏ qua lỗi khi build (Giữ nguyên của bạn)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 2. Cấu hình ảnh (Giữ nguyên của bạn)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // 3. [QUAN TRỌNG MỚI THÊM] Kết nối Frontend với Backend (Cổng 5280)
  async rewrites() {
    return [
      {
        // Khi Frontend gọi: /api/analysis/history...
        source: '/api/:path*',
        // Nó sẽ tự động chuyển tiếp sang: http://localhost:5280/api/analysis/history...
        destination: 'http://localhost:5280/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;