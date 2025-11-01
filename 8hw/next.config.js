/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Polyfills for Node core modules used by Next internal gzip-size in dev
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
    };
    return config;
  },
};

module.exports = nextConfig;