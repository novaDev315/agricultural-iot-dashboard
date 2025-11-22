/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@agri-iot/shared'],
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
