import post from "./Query/post";
import postDirectory from "./Query/postDirectory";
import posts from "./Query/posts";

export default {
  Query: {
    posts,
    post,
    postDirectory,
  },
  Node: {
    __resolveType: (obj) => obj.__typeName,
  },
};
