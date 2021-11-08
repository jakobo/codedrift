import draft from "./Query/draft";
import post from "./Query/post";
import postDirectory from "./Query/postDirectory";
import posts from "./Query/posts";
import tag from "./Query/tag";
import webmentions from "./Query/webmentions";

export default {
  Query: {
    draft,
    posts,
    post,
    postDirectory,
    tag,
    webmentions,
  },
  Node: {
    __resolveType: (obj) => obj.__typeName,
  },
};
