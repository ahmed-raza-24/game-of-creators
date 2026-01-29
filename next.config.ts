// next.config.ts - UPDATED
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Updated images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;