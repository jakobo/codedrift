import { gql } from "apollo-server-micro";

const forwardConnectionArgs = (...additionalArgs) => `
  "Returns the first n elements from the list"
  first: Int
  "Returns the elements in the list that come after the specified cursor"
  after: String
  ${additionalArgs.join("\n")}
`;

export default gql`
  interface Node {
    id: ID!
  }

  "Relay-compliant PageInfo Object"
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  """
  Tags as currently described by Ghost, reduced to relevant bits

  See https://ghost.org/docs/content-api/#tags
  """
  type Tag {
    id: ID!
    name: String!
    "An opaque string that can be used to find all data related to this tag"
    slug: String!
    description: String
    "Is the tag normally visible to others"
    visibility: String
    metaTitle: String
    metaDescription: String
  }

  """
  Bookmarks come from Ghost and are tagged with the #bm tag internally
  Most Bookmarks have equivalent fields in ghost, except where noted.
  This is to keep all content generation in a single place where I
  don't have to think about things like authorizations, etc. Sometimes,
  you just want to write.

  See https://ghost.org/docs/content-api/#posts
  """
  type Bookmark {
    id: String!
    title: String
    publishedAt: String!
    url: String!
    tags: [Tag]
    comments: String
  }

  type BookmarkConnection {
    pageInfo: PageInfo!
    edges: [BookmarkEdge]
  }

  type BookmarkEdge {
    node: Bookmark
    cursor: String!
  }

  """
  Timeline entries can come from multiple sources, but are centralized
  under a single API
  """
  type TimelineEntry implements Node {
    id: ID!
    type: TimelineEntryType!
    slug: String!
    title: String!
    excerpt: String
    image: String
    createdAt: String
  }

  enum TimelineEntryType {
    Post
    RevisedPost
  }

  type TimelineEntryConnection {
    pageInfo: PageInfo!
    edges: [TimelineEntryEdge]
  }

  type TimelineEntryEdge {
    node: TimelineEntry
    cursor: String!
  }

  "Details a signficant change to a post, extracted from post metadata"
  type PostChangelog {
    on: String
    change: String
  }

  """
  Posts come from Ghost and are tagged with the #post tag internally
  Most fields have an equivalent in Ghost, though they might also
  receive some data massaging. If a field looks non-ghostey, it's
  probably coming from codeinjection_head, where I am emulating the
  Ghost.org equivalent of frontmatter as YAML

  See: https://ghost.org/docs/content-api/#posts
  """
  type Post implements Node {
    id: ID!
    slug: String!
    title: String!
    excerpt: String
    featuredImage: String
    publishedAt: String!
    updatedAt: String!
    "YAML Frontmatter conversion detailing the list of changes"
    changelog: [PostChangelog]
    "The post's primary category"
    category: Tag!
    "Additional categories associated with the post. Not enough to warrant a connection"
    tags: [Tag]
    html: String
    readingTime: Int
    ogImage: String
    ogTitle: String
    ogDescription: String
    twitterDescription: String
    twitterImage: String
    twitterTitle: String
    metaTitle: String
    metaDescription: String
  }

  type PostConnection {
    pageInfo: PageInfo!
    edges: [PostEdge]
  }

  type PostEdge {
    node: Post
    cursor: String!
  }

  # type Repository {
  #   id: String!
  #   org: String
  #   name: String!
  #   description: String
  #   stars: Int
  # }

  # type AMA {
  #   id: String
  #   postedAt: String!
  #   question: String!
  #   url: String!
  # }

  type Query {
    """
    Retrieve a list of posts
    """
    posts(
      ${forwardConnectionArgs(
        `"A valid filter parameter. See https://ghost.org/docs/content-api/#filtering" filter: String`,
        `"A valid ordering parameter. See https://ghost.org/docs/content-api/#order" orderBy: String`
      )}
    ): PostConnection!

    """
    Retrieve the Timeline of events
    """
    timeline(
      ${forwardConnectionArgs(
        `"A valid filter parameter. See https://ghost.org/docs/content-api/#filtering" filter: String`,
        `"A valid ordering parameter. See https://ghost.org/docs/content-api/#order" orderBy: String`
      )}
    ): TimelineEntryConnection!

    """
    Retrieve a list of bookmarks
    """
    bookmarks(
      ${forwardConnectionArgs(
        `"A valid filter parameter. See https://ghost.org/docs/content-api/#filtering" filter: String`,
        `"A valid ordering parameter. See https://ghost.org/docs/content-api/#order" orderBy: String`
      )}
    ): BookmarkConnection!

    """
    Retrieve a single post by its id or slug
    """
    post(
      id: ID
      slug: String
    ): Post

  }
`;
/*
To implement

    """
    Retrieve a list of bookmarks
    """
    bookmarks(
      ${forwardConnectionArgs(
        `"A valid filter parameter. See https://ghost.org/docs/content-api/#filtering" filter: String`,
        `"A valid ordering parameter. See https://ghost.org/docs/content-api/#order" orderBy: String`
      )}
    ): BookmarkConnection!
*/

export const TimelineEntryType = {
  Post: "Post",
  RevisedPost: "RevisedPost",
};

export const PostFields = [
  "id",
  "slug",
  "title",
  "excerpt",
  "featuredImage",
  "publishedAt",
  "updatedAt",
  "changelog",
  "category",
  "tags",
  "html",
  "readingTime",
  "ogImage",
  "ogTitle",
  "ogDescription",
  "twitterDescription",
  "twitterImage",
  "twitterTitle",
  "metaTitle",
  "metaDescription",
];

export const TagFields = [
  "id",
  "name",
  "slug",
  "description",
  "visibility",
  "metaTitle",
  "metaDescription",
];
