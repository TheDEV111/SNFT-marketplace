import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use Turbopack configuration instead of webpack
  turbopack: {},
  
  // Externalize problematic packages to avoid bundling test files
  serverExternalPackages: [
    'thread-stream',
    'pino',
    '@walletconnect/universal-provider',
  ],
};

export default nextConfig;
