// next.config.ts - UPDATED
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Remove env object as it's not needed
};

module.exports = nextConfig;