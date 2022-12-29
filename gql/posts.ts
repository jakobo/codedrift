import { DISCUSSION_CATEGORIES, REPO_NAME, REPO_OWNER } from "lib/constants";
import {
  $,
  $$,
  Discussion,
  DiscussionOrderField,
  fragment,
  OrderDirection,
  query,
  SearchType,
} from "__generated__/github";

export const postDetails = fragment(Discussion, (d) => [
  d.id,
  d.title,
  d.lastEditedAt,
  d.url,
  d.labels({ first: 100 }, (lb) => [
    lb.nodes((b) => [b.id, b.name, b.description]),
  ]),
  d.author((a) => [a.$on("User", (u) => [u.avatarUrl({ size: 10 }), u.login])]),
  d.body,
]);

/** A query object representing post data for the purposes of converting data from github to codedrift */
export const postData = query((q) => [
  q.repository({ owner: "", name: "" }, (r) => [
    r.discussions((c) => [c.nodes((d) => [...postDetails])]),
  ]),
]);

export const selectedPostsWithSearch = query((q) => [
  q.search(
    {
      first: $("first"),
      after: $("after"),
      query: $$("search"),
      type: SearchType.DISCUSSION,
    },
    (s) => [
      s.discussionCount,
      s.pageInfo((p) => [
        p.endCursor,
        p.hasNextPage,
        p.hasPreviousPage,
        p.startCursor,
      ]),
      s.nodes((n) => [n.$on("Discussion", (d) => [...postDetails])]),
    ]
  ),
]);

export const recentPosts = query((q) => [
  q.repository({ owner: REPO_OWNER, name: REPO_NAME }, (r) => [
    r.discussions(
      {
        categoryId: DISCUSSION_CATEGORIES.blog,
        first: $$("first"),
        after: $("after"),
        orderBy: {
          field: DiscussionOrderField.CREATED_AT,
          direction: OrderDirection.DESC,
        },
      },
      (c) => [
        c.nodes((d) => [...postDetails]),
        c.totalCount,
        c.pageInfo((p) => [
          p.endCursor,
          p.hasNextPage,
          p.hasPreviousPage,
          p.startCursor,
        ]),
      ]
    ),
  ]),
]);
