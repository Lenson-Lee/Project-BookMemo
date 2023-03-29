/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  publicRuntimeConfig: {
    apiKey: process.env.publicApiKey || "",
    authDomain: process.env.FIREBASE_AUTH_HOST || "",
    projectId: process.env.projectId || "",
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  images: {
    domains: [
      "next.tiuminc.com/",
      "image.aladin.co.kr",
      "lh3.googleusercontent.com",
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      ![];
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
