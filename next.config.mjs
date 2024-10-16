/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'airline-datacenter.s3.ap-south-1.amazonaws.com',
        port: '', // Leave empty for no specific port
        pathname: '/**', // Allow all paths from this domain
      },
    ],
      
  },
};

export default nextConfig;
