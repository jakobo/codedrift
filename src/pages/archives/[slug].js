import React from "react";
import { gql, useQuery } from "urql";
import { useRouter } from "next/router";
import { parse } from "src/lib/rehype";

const GET_POST = gql`
  query GetPostBySlug($slug: String!) {
    postBySlug(slug: $slug) {
      id
      title
      html
    }
  }
`;

export default function Post() {
  const route = useRouter();
  const [{ data, fetching }] = useQuery({
    query: GET_POST,
    variables: {
      slug: route.query.slug,
    },
  });

  let content = null;
  if (data?.postBySlug) {
    content = parse(data.postBySlug.html);
  }

  return <div>{content}</div>;
}
