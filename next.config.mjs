const isProd = process.env.NODE_ENV === 'production';

export default {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/saikuru-dashboard' : '',
  assetPrefix: isProd ? '/saikuru-dashboard/' : '',
};