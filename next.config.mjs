/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/saikuru-dashboard',
  assetPrefix: '/saikuru-dashboard',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;