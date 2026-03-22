import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.bigbrain.gg',
        pathname: '**', // Allows all paths under this domain
      },
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
        pathname: '/**', // Standard for Riot's CDN assets
      },
    ],
  },
};

export default nextConfig;