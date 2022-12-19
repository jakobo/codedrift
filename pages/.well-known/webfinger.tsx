import { GetServerSideProps } from "next";
import z from "zod";

const jakob = {
  subject: "acct:jakob@codedrift.com",
  aliases: [
    "https://hachyderm.io/@jakobo",
    "https://hachyderm.io/users/jakobo",
  ],
  links: [
    {
      rel: "http://webfinger.net/rel/profile-page",
      type: "text/html",
      href: "https://hachyderm.io/@jakobo",
    },
    {
      rel: "self",
      type: "application/activity+json",
      href: "https://hachyderm.io/users/jakobo",
    },
    {
      rel: "http://ostatus.org/schema/1.0/subscribe",
      template: "https://hachyderm.io/authorize_interaction?uri={uri}",
    },
  ],
};

export default function Webfinger({ status, message }) {
  return `${status}: ${message}`;
}

const webfinger = z
  .object({
    resource: z.string().regex(/^acct:*/),
  })
  .strip();

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  try {
    const body = webfinger.parse(query);
    if (/^acct:jakob@codedrift.com$/.test(body.resource)) {
      res.statusCode = 200;
      res.setHeader("Cache-Control", "s-maxage=86400");
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(jakob));
      res.end();
      return {
        props: {},
      };
    }
  } catch (e) {
    res.statusCode = 400;
    res.statusMessage = "Bad Request";
    res.end();
    return {
      props: {},
    };
  }

  return {
    notFound: true,
  };
};
