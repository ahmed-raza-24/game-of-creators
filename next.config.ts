/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add these
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
