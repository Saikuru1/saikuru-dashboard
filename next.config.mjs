/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/saikuru-dashboard',
  assetPrefix: '/saikuru-dashboard/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;