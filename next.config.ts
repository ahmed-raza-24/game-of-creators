/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove eslint config (causing warning)
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  // Add headers for LinkedIn
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' *.linkedin.com *.licdn.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.linkedin.com; style-src 'self' 'unsafe-inline' *.linkedin.com;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig;