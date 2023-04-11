/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    responseLimit: "8mb",
  },
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
      "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/P1z/image/H8TJP-BBKpYDa7ApSI22w6PH36E.JPG",
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
