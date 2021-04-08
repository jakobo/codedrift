import { gql } from "apollo-server-micro";

const forwardConnectionArgs = `
  "Returns the first n elements from the list"
  first: Int
  "Returns the elements in the list that come after the specified cursor"
  after: String
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

  Todo: Not supporting bookmarks right now. In fact, I'd rather use a dedicated
  service... but those really don't exist anymore.

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
    slug: String
    title: String!
    content: String
    contentType: TimelineEntryContentType!
    image: String
    createdAt: String
  }

  enum TimelineEntryType {
    Post
    RevisedPost
    Event
  }

  enum TimelineEntryContentType {
    text
    html
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
  Post summaries are shortened information about posts. Just enough
  to make something useful for a search engine to work with. All data
  comes from Ghost. Not optimized for cursor based pagination

  See: https://ghost.org/docs/content-api/#posts
  """
  type PostDirectoryEntry {
    id: ID!
    slug: String!
    title: String!
    excerpt: String
    publishedAt: String!
    updatedAt: String!
    "The post's primary category"
    category: Tag
    "Additional categories associated with the post. Not enough to warrant a connection"
    tags: [Tag]
    "YAML Frontmatter conversion detailing the list of changes"
    changelog: [PostChangelog]
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
    category: Tag
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

  type WebmentionAuthor {
    id: String!
    name: String
    url: String
    photo: String
  }

  type Webmention {
    id: String!
    type: String!
    source: String!
    url: String!
    author: WebmentionAuthor
    publishedAt: String!
    content: String
  }

  type WebmentionConnection {
    pageInfo: PageInfo!
    edges: [WebmentionEdge]
  }

  type WebmentionEdge {
    node: Webmention
    cursor: String!
  }

  type Query {
    """
    Retrieve a list of posts
    """
    posts(
      ${forwardConnectionArgs}
      "A valid filter parameter. See https://ghost.org/docs/content-api/#filtering" filter: String
      "A valid ordering parameter. See https://ghost.org/docs/content-api/#order" orderBy: String
    ): PostConnection!

    """
    Get a list of all posts, often for a search engine
    """
    postDirectory(
      "A valid filter parameter. See https://ghost.org/docs/content-api/#filtering" filter: String
      "A valid ordering parameter. See https://ghost.org/docs/content-api/#order" orderBy: String
    ): [PostDirectoryEntry]

    """
    Retrieve a single post by its id or slug
    """
    post(
      id: ID
      slug: String
    ): Post

    """
    Retrieve tag details by its id or name
    """
    tag(
      id: ID
      name: String
    ): Tag

    """
    Get a list of pingbacks and mentions for a given URL
    """
    webmentions(
      ${forwardConnectionArgs}
      "The URL to check mentions for. See https://github.com/aaronpk/webmention.io#api" url: String!
      "A filtering string, comma separated. See https://github.com/aaronpk/webmention.io#api" filter: String
      "A valid sort-by parameter. See https://github.com/aaronpk/webmention.io#api" sortBy: String = "published"
      "A valid sort-dir parameter. See https://github.com/aaronpk/webmention.io#api" sortDir: String = "up"
      "Should the URL be interpreted literally, or should variations be considered?" literal: Boolean = "false"
    ): WebmentionConnection!

  }
`;

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

export const PostDirectoryEntryFields = [
  "id",
  "slug",
  "title",
  "excerpt",
  "publishedAt",
  "updatedAt",
  "category",
  "tags",
  "changelog",
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
