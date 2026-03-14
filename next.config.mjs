/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'static.bigbrain.gg',
      'ddragon.leagueoflegends.com',
    ],
  },
};

export default nextConfig;
