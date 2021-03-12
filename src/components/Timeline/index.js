import { gql } from "@urql/core";
import { useQuery } from "urql";
import { useState } from "react";

const TIMELINE = gql`
  query Timeline($first: Int!, $filter: String, $after: String) {
    timeline(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          title
          type
          createdAt
          content
          contentType
        }
      }
    }
  }
`;

export const FiniteTimeline = ({ size, omit = [] } = {}) => {
  const filter =
    omit && omit.length ? omit.map((o) => `id:-${o}`).join("+") : null;
  const [{ data }] = useQuery({
    query: TIMELINE,
    variables: {
      first: size,
      filter,
    },
  });

  console.log(data);
  return null;
};

export default function Timeline({ startDate = null }) {
  // published_at:>'2017-06-03 23:43:12'
  const [cursor, setCursor] = useState(null);
  // WIP
  console.log(startDate, cursor, setCursor);
}
