// // next.config.js - FINAL VERSION FOR DEPLOYMENT
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // ========== TEMPORARY FIXES (for build only) ==========
//   typescript: {
//     ignoreBuildErrors: true, // Ignore TypeScript errors during build
//   },
//   eslint: {
//     ignoreDuringBuilds: true, // Ignore ESLint errors during build
//   },
  
//   // ========== IMAGES CONFIG ==========
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'lh3.googleusercontent.com',
//         pathname: '**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'media.licdn.com',
//         pathname: '**',
//       },
//       {
//         protocol: 'https',
//         hostname: '*.cdninstagram.com',
//         pathname: '**',
//       },
//     ],
//   },
  
//   // ========== DEPLOYMENT OPTIMIZATION ==========
//   output: 'standalone', // Better for Vercel deployment
  
//   // ========== FIX FOR PRE-RENDER ERROR ==========
//   // This prevents Next.js from trying to pre-render client-only pages
//   experimental: {
//     // Optimize Turbopack builds
//     turbo: {
//       resolveExtensions: [
//         '.mdx',
//         '.tsx',
//         '.ts',
//         '.jsx',
//         '.js',
//         '.mjs',
//         '.json'
//       ]
//     }
//   },
  
//   // ========== WEBPACK CONFIG ==========
//   webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
//     // Important: Fix for client-side code being called during build
//     if (isServer) {
//       config.externals.push({
//         'react': 'commonjs react',
//         'react-dom': 'commonjs react-dom',
//         'next': 'commonjs next',
//       });
//     }
    
//     return config;
//   }
// };

// module.exports = nextConfig;