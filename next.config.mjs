const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true
  },
  basePath: isProd ? '/<repo-name>' : '',
  assetPrefix: isProd ? '/<repo-name>/' : ''
};

export default nextConfig;