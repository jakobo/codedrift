// const GET_POST = gql`
//   query GetPostBySlug($slug: String!) {
//     postBySlug(slug: $slug) {
//       id
//       title
//       html
//     }
//   }
// `;

// /thunked (writing index)
// /thunked/tag/name (listed by tags)
// /thunked/slug (single post)

export default function ThunkedBySlug() {
  return null;
  // const route = useRouter();
  // const [{ data, fetching }] = useQuery({
  //   query: GET_POST,
  //   variables: {
  //     slug: route.query.slug,
  //   },
  // });

  // let content = null;
  // if (data?.postBySlug) {
  //   content = parse(data.postBySlug.html);
  // }

  // return <div>{content}</div>;
}
