import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['img.clerk.com', 'res.cloudinary.com', 'images.unsplash.com']
  }
};

export default nextConfig;
