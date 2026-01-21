/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  // REMOVE CSP headers - yeh errors de rahe hain
}

module.exports = nextConfig;