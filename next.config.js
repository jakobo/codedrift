// this file is not transpiled using babel
// it should work in your node.js environment with no additional changes

const createConfig = () => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    poweredByHeader: false,
    images: {
      domains: ["codedrift.com", "localhost"],
    },
    experimental: { esmExternals: true },
    webpack: (webpackConfig, { webpack }) => {
      // allow .js to resolve to valid extensions
      webpackConfig.resolve.extensionAlias = {
        ".js": [".ts", ".tsx", ".js", ".jsx"],
        ".mjs": [".mts", ".mjs"],
        ".cjs": [".cts", ".cjs"],
      };

      // // allow loading of .node files (such as sharp)
      // webpackConfig.module.rules.push({
      //   test: /\.node$/,
      //   loader: "node-loader",
      // });

      return webpackConfig;
    },
    async redirects() {
      return [
        {
          source: "/support",
          destination: "/help",
          permanent: true,
        },
      ];
    },
    async rewrites() {
      return [
        {
          source: "/notes/",
          destination:
            "https://publish.obsidian.md/serve?url=codedrift.com/notes",
        },
        {
          source: "/notes/:path*",
          destination:
            "https://publish.obsidian.md/serve?url=codedrift.com/notes/:path*",
        },
      ];
    },
  };

  return nextConfig;
};

export default createConfig;
