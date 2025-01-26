/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    }
  }
};

export default nextConfig;
