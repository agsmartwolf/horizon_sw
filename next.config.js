const fetch = require('node-fetch');
const isDev = process.env.NODE_ENV === 'development';
const storeUrl = process.env.NEXT_PUBLIC_SWELL_STORE_URL;
const graphqlKey = process.env.NEXT_PUBLIC_SWELL_PUBLIC_KEY;

/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.schema.io', ...(isDev ? ['cdn.swell.test'] : [])],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  rewrites() {
    return [
      {
        destination: '/api/:slug*',
        source: '/horizon-api/:slug*',
      },
    ];
  },
};

module.exports = async () => {
  return nextConfig;
};
