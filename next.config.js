const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer");
const withPWA = require("next-pwa");

module.exports = withPlugins(
  [
    [
      withBundleAnalyzer({
        enabled: process.env.ANALYZE === "true",
      }),
    ],
    [
      withPWA,
      {
        pwa: {
          disable: process.env.NODE_ENV === "development",
          dest: "public",
        },
      },
    ],
  ],
  {
    reactStrictMode: true,
    assetPrefix:
      process.env.NODE_ENV === "production"
        ? "https://thursday.cdn.robertying.net"
        : "",
    compress: false,
  }
);
