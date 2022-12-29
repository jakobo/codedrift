/** Repository owner for GQL calls */
export const REPO_OWNER = "jakobo" as const;
/** Repository name for GQL calls */
export const REPO_NAME = "codedrift" as const;
/** The combo owner/name for search queries */
export const REPO_FQN = `${REPO_OWNER}/${REPO_NAME}`;

/**
 * Discussion categories in the repository
 * These IDS can be retrieved with the following GraphQL call,
 * via the graphql explorer https://docs.github.com/en/graphql/overview/explorer
 * ```gql
 *  query {
 *    repository(owner: "jakobo", name: "codedrift") {
 *      discussionCategories(first: 100) {
 *        edges {
 *          node {
 *            id
 *            name
 *          }
 *        }
 *      }
 *    }
 *  }
 * ```
 */
export const DISCUSSION_CATEGORIES = {
  blog: "DIC_kwDOFC_g4s4CAYqP",
  blogDrafts: "DIC_kwDOFC_g4s4CTUZK",
  AMA: "DIC_kwDOFC_g4s4CAYqR",
  TIL: "DIC_kwDOFC_g4s4CTUZj",
} as const;
