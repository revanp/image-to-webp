/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig; 