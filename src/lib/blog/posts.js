import fs from "fs-extra";
import globby from "globby";
import matter from "gray-matter";
import readingTime from "reading-time";

// [1] = slug, [2] = lang
const EXTRACTOR = /.+?\/blog\/(.+?)\/(.+?)\.md/;

const allPosts = async () => {
  const paths = await globby(["./data/blog/**/*.md"], {
    cwd: process.cwd(),
  });

  const posts = paths.reduce((a, p) => {
    const [original, slug, lang] = p.match(EXTRACTOR);
    const parsedLang = lang.toLowerCase() === "index" ? "en-us" : lang;

    if (!a[slug]) {
      a[slug] = { variants: {} };
    }

    // parse its frontmatter
    const fileContents = fs.readFileSync(original, "UTF-8");
    const { data: frontMatter, content } = matter(fileContents);
    const rt = readingTime(content);

    a[slug].variants[parsedLang] = {
      metadata: {
        ...frontMatter,
        file: original,
      },
    };

    // en articles contain the global metadata, which is overwritten by language-specific
    // variants. This way there's always a source of truth in the index file
    if (lang === "index") {
      a[slug].metadata = {
        ...frontMatter,
        slug,
        estimate: Math.ceil(rt.minutes),
      };
    }

    return a;
  }, {});

  return posts;
};

const onePost = async (name, lang = null) => {
  const rootPost = `./data/blog/${name}/index.md`;
  const langPost =
    lang && lang !== "en-us" ? `./data/blog/${name}/${lang}.md` : null;

  const rootContents = fs.readFileSync(rootPost, "UTF-8");
  const { data: rootMeta, content: rootParsed } = matter(rootContents);

  // if no lang specified, or lang is en-us, return the default post object
  // else, load a language specific version and override the generic metada
  if (!lang || lang === "en-us") {
    return {
      metadata: rootMeta,
      content: rootParsed,
    };
  } else {
    const langContents = fs.readFileSync(langPost, "UTF-8");
    const { data: langMeta, content: langParsed } = matter(langContents);
    return {
      metadata: {
        ...rootMeta,
        ...langMeta,
      },
      content: langParsed,
    };
  }
};

export { allPosts, onePost };
