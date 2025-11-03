import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['maps.googleapis.com', 'example.com', 'm.media-amazon.com'], // <-- Add this
    
  },
  
  experimental: {
    globalNotFound: true,
    serverComponentsExternalPackages: ['puppeteer-core'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'leaflet.markercluster': 'leaflet.markercluster/dist/leaflet.markercluster-src.js',
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
  
  // Timeout augmenté pour les API longues
  api: {
    responseLimit: '10mb',
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default nextConfig;
