import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'static.bigbrain.gg',
      'ddragon.leagueoflegends.com',
    ],
  },
};

export default nextConfig;
