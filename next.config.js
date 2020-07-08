const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer");

module.exports = withPlugins(
  [
    [
      withBundleAnalyzer({
        enabled: process.env.ANALYZE === "true",
      }),
    ],
  ],
  {
    assetPrefix:
      process.env.NODE_ENV === "production"
        ? "https://thursday.cdn.robertying.net"
        : "",
    compress: false,
  }
);
