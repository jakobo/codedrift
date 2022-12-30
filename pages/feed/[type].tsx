import { DateTime } from "luxon";
import { GetServerSideProps } from "next";
import React from "react";
import sort from "sort-array";
import { Feed } from "feed";
import { initDefaultUrqlClient } from "gql";
import { discussionToBlog } from "lib/github/discussionToBlog";
import { recentPosts } from "gql/posts";

const NoReact: React.FC = () => null;
const done = {
  props: {},
};

const POSTS_IN_FEED = 25;

export const getServerSideProps: GetServerSideProps<{}> = async ({
  // query,
  params,
  res,
}) => {
  const type = Array.isArray(params.type) ? params.type[0] : params.type;
  const { client } = initDefaultUrqlClient(false);

  const { data } = await client
    .query(recentPosts, {
      first: POSTS_IN_FEED,
    })
    .toPromise();

  const feed = new Feed({
    title: "Codedrift",
    description: "Content from codedrift.com",
    id: "https://codedrift.com",
    link: "https://codedrift.com",
    copyright: "Some rights reserved 2021, Jakob Heuser",
    language: "en",
    generator: "feed(npm)",
    feedLinks: {
      json: "https://codedrift.com/feed/json",
      atom: "https://codedrift.com/feed/atom",
    },
    author: {
      name: "Jakob Heuser",
    },
  });

  // add thunked items
  (data?.repository?.discussions?.nodes || [])
    .map((item) => discussionToBlog(item))
    .forEach((item) => {
      feed.addItem({
        title: item.title,
        id: item.canonicalUrl,
        link: item.canonicalUrl,
        description: item.description,
        content: item.html || item.body,
        author: [
          {
            name: "Jakob Heuser",
          },
        ],
        date: DateTime.fromISO(item.publishedAt).toJSDate(),
        category: (item.category ? [item.category.name] : [])
          .concat(item.tags.map((t) => t.name))
          .map((cat) => ({
            name: cat,
          })),
      });
    });

  // perform final sort and slice
  feed.items = sort(feed.items, {
    by: "date_published",
    order: "desc",
  });

  if (!res) {
    return {
      notFound: true,
    };
  }

  if (type === "json") {
    res.setHeader("Content-Type", "application/feed+json; charset=UTF-8");
    res.write(feed.json1());
    res.end();
    return done;
  }

  if (type === "rss") {
    res.setHeader("Content-Type", "application/rss+xml; charset=UTF-8");
    res.write(feed.rss2());
    res.end();
    return done;
  }

  if (type === "atom") {
    res.setHeader("Content-Type", "application/atom+xml; charset=UTF-8");
    res.write(feed.atom1());
    res.end();
    return done;
  }

  return {
    notFound: true,
  };
};

export default NoReact;
