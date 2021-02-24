import fs from "fs-extra";
import glob from "globby";
import matter from "gray-matter";
import readingTime from "reading-time";

// globally defined
const posts = { loaded: false, list: [] };

// [1] = slug, [2] = lang
const EXTRACTOR = /posts\/(.+?)\/(.+?)\.md/;
const MAIN_GLOB = "posts/**/*.md";

// drafts are in a different folder
const DRAFT_EXTRACTOR = /posts-todo\/(.+?)\/(.+?)\.md/;
const DRAFT_GLOB = "posts-todo/**/*.md";

const decoratePost = async (p) => {
  // reading time
  p.readingTime = Math.ceil(readingTime(p.content).minutes);
  return p;
};

const loadPost = async (p, { draft = false } = {}) => {
  const [, slug, lang] = p.match(draft ? DRAFT_EXTRACTOR : EXTRACTOR);
  const parsedLang = lang.toLowerCase() === "index" ? "en-us" : lang;
  const buf = await fs.readFile(p);
  const fileContents = buf.toString();
  const { data: frontMatter, content } = matter(fileContents);
  const rt = readingTime(content);
  const post = await decoratePost({
    ...frontMatter,
    slug,
    language: parsedLang,
    readingTime: Math.ceil(rt.minutes),
    content,
  });
  posts.list.push(post);
};

const getAllPosts = async ({ draft = false } = {}) => {
  if (posts.loaded) {
    return posts.list;
  }
  if (posts.pending) {
    return posts.pending;
  }

  // faux deferred promise
  let resolvePending;
  posts.pending = new Promise((res) => {
    resolvePending = res;
  });

  const paths = await glob(draft ? DRAFT_GLOB : MAIN_GLOB);
  const promises = [];
  for (const p of paths) {
    promises.push(loadPost(p, { draft }));
  }

  // wait for all files to be loaded
  await Promise.all(promises);
  posts.loaded = true;
  resolvePending(posts.list);
  return posts.list;
};

const orderByCast = {
  date: (d) => new Date(d).getTime(),
};

// getPosts({ orderBy: ["date", "desc"], first: 3 });
// getPosts({ where: (item => item.date === "2002-01-01"), orderBy: [["date", "DESC"]], first: 3 });
export const getPosts = async ({
  where = () => true,
  orderBy = [],
  first,
  last,
  draft = false,
  offset = 0,
}) => {
  let ps = await getAllPosts({ draft });
  // where
  ps = ps.filter((p) => where(p.metadata));

  // order by (sort in place)
  if (orderBy.length) {
    ps.sort((lf, rt) => {
      let decided = 0;
      orderBy.forEach(([name, ord]) => {
        if (decided !== 0) return;
        const order = `${ord}`.toLowerCase();
        const lfVal = lf?.[name] || null;
        const rtVal = rt?.[name] || null;
        const left = orderByCast[name] ? orderByCast[name](lfVal) : lfVal;
        const right = orderByCast[name] ? orderByCast[name](rtVal) : rtVal;

        if (left < right) decided = -1;
        else if (left > right) decided = 1;
        decided = order === "desc" ? -1 * decided : decided;
        return decided;
      });
      return decided;
    });
  }

  // offset
  ps = ps.slice(offset);

  // first + last
  if (first) {
    ps = ps.slice(0, first);
  } else if (last) {
    ps = ps.slice(-1 * last);
  }

  return ps;
};
