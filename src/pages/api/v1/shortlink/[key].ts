import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { findUp } from "find-up";
import yaml from "js-yaml";
import { shortlink, shortlinkYaml } from "src/data/shortlinks";

export type APIResponse = {
  link: shortlink;
};

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>
) {
  const key = Array.isArray(req.query.key) ? req.query.key[0] : req.query.key;
  const root = await findUp("package.json", { cwd: __dirname });
  const dir = path.dirname(root);
  const linkFile = path.resolve(dir, "./src/data/shortlinks.yaml");
  const contents = await fs.readFile(linkFile, "utf-8");
  const data = yaml.load(contents) as shortlinkYaml;
  const link = data.links[key] || null;

  res.status(200).json({
    link: {
      url: typeof link === "string" ? link : link.url,
      description: typeof link === "string" ? null : link.description,
    },
  });
}
