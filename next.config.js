// this file is not transpiled using babel
// it should work in your node.js environment with no additional changes

module.exports = () => {
  return {
    poweredByHeader: false,
    images: {
      domains: ["codedrift.com", "localhost"],
    },
    experimental: { esmExternals: true },
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
};
