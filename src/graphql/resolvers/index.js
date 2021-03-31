import post from "./Query/post";
import postDirectory from "./Query/postDirectory";
import posts from "./Query/posts";
import tag from "./Query/tag";

export default {
  Query: {
    posts,
    post,
    postDirectory,
    tag,
  },
  Node: {
    __resolveType: (obj) => obj.__typeName,
  },
};
