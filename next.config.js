/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => config,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;