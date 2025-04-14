/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Your API domain
      {
        protocol: 'http',
        hostname: 'bitary.runasp.net',
        pathname: '/api/Products/**',
      },
      // PetSmart image CDN
      {
        protocol: 'https',
        hostname: 's7d2.scene7.com',
        pathname: '/is/image/**',
      },
      // Other domains you're using
      {
        protocol: 'https',
        hostname: 'www.purina.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig