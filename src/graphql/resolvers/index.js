import posts from "./Query/posts";
import post from "./Query/post";
import timeline from "./Query/timeline";
import bookmarks from "./Query/bookmarks";

export default {
  Query: {
    posts,
    post,
    timeline,
    bookmarks,
  },
  Node: {
    __resolveType: (obj) => obj.__typeName,
  },
};
