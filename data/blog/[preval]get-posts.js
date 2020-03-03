//@preval
// MUST BE SYNCHRONOUS
// HANDLED AT BUILD TIME & RUNS IN NODE.JS SYSTEM

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const gm = require("gray-matter");

const files = glob.sync("**/*.md", {
  cwd: __dirname,
});

const DEFAULT_FILE = /\/index.md$/;
const WC_SPLIT = /[\S]+/g;

module.exports = files
  .map(file => {
    const p = gm(fs.readFileSync(path.join(__dirname, "./", file), "utf8"));
    return {
      path: file,
      slug: DEFAULT_FILE.test(file)
        ? file.replace(/^(.+)\/index\.md$/, "$1")
        : file.replace(/^(.+)\/(.+?)\.md$/, "$2/$1"),
      meta: {
        wc: (p.content.match(WC_SPLIT) || []).length,
        ...p.data,
      },
    };
  })
  .filter(p => !!p.meta.published)
  .sort((a, b) => {
    return new Date(b.meta.date) - new Date(a.meta.date);
  });
