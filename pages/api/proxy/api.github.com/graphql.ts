// an explicit proxy for github graphql requests
// hides the PAT
import process from "process"; // eslint-disable-line unicorn/prefer-node-protocol
import { createProxyMiddleware } from "http-proxy-middleware";

const mw = createProxyMiddleware({
  target: "https://api.github.com/graphql",
  pathRewrite: () => "",
  xfwd: true,
  changeOrigin: true,
  headers: {
    Authorization: `bearer ${process.env.GITHUB_PAT}`,
  },
});

export default mw;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
