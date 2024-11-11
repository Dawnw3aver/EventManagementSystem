/** @type {import('next').NextConfig} */
module.exports = {
    output: "standalone",
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://eventify.ddns.net/api/:path*',
        },
        {
          source: '/uploads/:path*',
          destination: 'https://eventify.ddns.net/uploads/:path*',
        },
      ]
    },
  };