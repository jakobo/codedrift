import { NextApiRequest, NextApiResponse } from "next";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import twnesting from "tailwindcss/nesting";
import Cors from "cors";
import { PROSE } from "data/constants";

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

const css = /* css */ `
@tailwind base;
@tailwind components;
@tailwind utilities;

.gsc-left-header{
    @apply gap-2;

    & * {
      @apply p-0 m-0 !important;
    }
  }

.gsc-comment-content {
  @apply ${PROSE} prose-sm !important;
}

main {
  --color-prettylights-syntax-comment: #8b949e;
  --color-prettylights-syntax-constant: #79c0ff;
  --color-prettylights-syntax-entity: #d2a8ff;
  --color-prettylights-syntax-storage-modifier-import: #c9d1d9;
  --color-prettylights-syntax-entity-tag: #7ee787;
  --color-prettylights-syntax-keyword: #ff7b72;
  --color-prettylights-syntax-string: #a5d6ff;
  --color-prettylights-syntax-variable: #ffa657;
  --color-prettylights-syntax-brackethighlighter-unmatched: #f85149;
  --color-prettylights-syntax-invalid-illegal-text: #f0f6fc;
  --color-prettylights-syntax-invalid-illegal-bg: #8e1519;
  --color-prettylights-syntax-carriage-return-text: #f0f6fc;
  --color-prettylights-syntax-carriage-return-bg: #b62324;
  --color-prettylights-syntax-string-regexp: #7ee787;
  --color-prettylights-syntax-markup-list: #f2cc60;
  --color-prettylights-syntax-markup-heading: #1f6feb;
  --color-prettylights-syntax-markup-italic: #c9d1d9;
  --color-prettylights-syntax-markup-bold: #c9d1d9;
  --color-prettylights-syntax-markup-deleted-text: #ffdcd7;
  --color-prettylights-syntax-markup-deleted-bg: #67060c;
  --color-prettylights-syntax-markup-inserted-text: #aff5b4;
  --color-prettylights-syntax-markup-inserted-bg: #033a16;
  --color-prettylights-syntax-markup-changed-text: #ffdfb6;
  --color-prettylights-syntax-markup-changed-bg: #5a1e02;
  --color-prettylights-syntax-markup-ignored-text: #c9d1d9;
  --color-prettylights-syntax-markup-ignored-bg: #1158c7;
  --color-prettylights-syntax-meta-diff-range: #d2a8ff;
  --color-prettylights-syntax-brackethighlighter-angle: #8b949e;
  --color-prettylights-syntax-sublimelinter-gutter-mark: #484f58;
  --color-prettylights-syntax-constant-other-reference-link: #a5d6ff;
  --color-btn-text: #ffffff;
  --color-btn-bg: #21262d;
  --color-btn-border: rgb(240 246 252 / 10%);
  --color-btn-shadow: 0 0 transparent;
  --color-btn-inset-shadow: 0 0 transparent;
  --color-btn-hover-bg: #30363d;
  --color-btn-hover-border: #8b949e;
  --color-btn-active-bg: hsl(212deg 12% 18% / 100%);
  --color-btn-active-border: #6e7681;
  --color-btn-selected-bg: #161b22;
  --color-btn-primary-text: #fff;
  --color-btn-primary-bg: #238636;
  --color-btn-primary-border: rgb(240 246 252 / 10%);
  --color-btn-primary-shadow: 0 0 transparent;
  --color-btn-primary-inset-shadow: 0 0 transparent;
  --color-btn-primary-hover-bg: #2ea043;
  --color-btn-primary-hover-border: rgb(240 246 252 / 10%);
  --color-btn-primary-selected-bg: #238636;
  --color-btn-primary-selected-shadow: 0 0 transparent;
  --color-btn-primary-disabled-text: rgb(255 255 255 / 50%);
  --color-btn-primary-disabled-bg: rgb(35 134 54 / 60%);
  --color-btn-primary-disabled-border: rgb(240 246 252 / 10%);

  @apply ${PROSE};
}

.gsc-comment-box-buttons {
  & .btn-primary {
    text-decoration: none !important;
    color: #fff !important;
  }
}
`;

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  const theme = req.query.theme === "dark" ? "dark" : "light";
  const c = theme === "dark" ? css.replace(/dark:/g, "") : css;

  const result = await postcss([twnesting, tailwindcss, autoprefixer]).process(
    c,
    {
      from: "public/styles/giscus.css",
      to: "public/styles/giscus-rendered.css",
    }
  );
  res.send(result.css);
}
