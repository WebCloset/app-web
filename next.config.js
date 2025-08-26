// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' data: https:",
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self'",
              "connect-src 'self' https://api-production-47a0.up.railway.app",
            ].join('; ')
          }
        ]
      }
    ];
  }
};
module.exports = nextConfig;