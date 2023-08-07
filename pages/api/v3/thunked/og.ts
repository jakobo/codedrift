import process from "process"; // eslint-disable-line unicorn/prefer-node-protocol
import path from "node:path";
import { Buffer } from "node:buffer";
import { type NextApiRequest, type NextApiResponse } from "next";
import sharp from "sharp";
import { DateTime } from "luxon";
import { firstOf } from "@/lib/firstOf.js";

const chevronLeft = `
<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#047857" stroke-width="3">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
</svg>
`;

const chevronRight = `
<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#047857" stroke-width="3">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
</svg>
`;

const W = 1200;
const H = 600;
const CS = 150;

const workSans = path.resolve(
  process.cwd(),
  "./public/font/work_sans/WorkSans-VariableFont_wght.ttf"
);

const openSans = path.resolve(
  process.cwd(),
  "./public/font/open_sans/OpenSans-VariableFont_wdth_wght.ttf"
);

const createOpenGraphImage = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const lt = await sharp(Buffer.from(chevronLeft)).resize(CS, CS).toBuffer();
  const rt = await sharp(Buffer.from(chevronRight)).resize(CS, CS).toBuffer();

  const title = firstOf(request.query.title);
  const category = firstOf(request.query.category) ?? "unknown";
  const tags = firstOf(request.query.tags);
  const updated = firstOf(request.query.updated);
  const published = firstOf(request.query.published);

  const ts = DateTime.fromSeconds(
    Number.parseInt(updated ?? published ?? "0", 10)
  ).toRelative();

  const s = await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: {
        r: 245,
        g: 245,
        b: 244,
      },
    },
  })
    .composite([
      {
        input: {
          create: {
            width: W,
            height: 24,
            channels: 3,
            background: {
              r: 87,
              g: 83,
              b: 78,
            },
          },
        },
        top: 0,
        left: 0,
      },
      {
        input: {
          create: {
            width: W,
            height: 64,
            channels: 3,
            background: {
              r: 68,
              g: 64,
              b: 60,
            },
          },
        },
        top: H - 64,
        left: 0,
      },
      {
        input: lt,
        top: H - CS - 48,
        left: 800,
      },
      {
        input: rt,
        top: H - CS - 24,
        left: 870,
      },
      {
        input: {
          text: {
            text: `<span bgcolor="#F5F5F4" fgcolor="#059669" size="32pt" face="Open Sans">codedrift</span>`,
            fontfile: openSans,
            width: 600,
            rgba: true,
          },
        },
        top: 482,
        left: 1000,
      },
      {
        input: {
          text: {
            text: `<span bgcolor="#F5F5F4" fgcolor="#57534e" size="24pt" face="Open Sans" weight="800">Thunked: Short essays on code and humans</span>`,
            fontfile: openSans,
            width: 600,
            rgba: true,
          },
        },
        top: 100,
        left: 64,
      },
      {
        input: {
          text: {
            text: `<span bgcolor="#F5F5F4" fgcolor="#292524" size="64pt" face="Work Sans">${title}</span>`,
            fontfile: workSans,
            width: 1100,
            rgba: true,
          },
        },
        top: 148,
        left: 64,
      },
      {
        input: {
          text: {
            text: `<span bgcolor="#F5F5F4" fgcolor="#57534e" size="18pt" face="Open Sans">${category} ${
              tags ? "+ " + tags : ""
            }</span>`,
            fontfile: openSans,
            width: 1100,
            rgba: true,
          },
        },
        top: 478,
        left: 64,
      },
      {
        input: {
          text: {
            text: `<span bgcolor="#F5F5F4" fgcolor="${
              updated ? "#059669" : "#57534e"
            }" size="18pt" face="Open Sans">${
              updated ? "updated" : "published"
            }</span><span bgcolor="#F5F5F4" fgcolor="#57534e" size="18pt" face="Open Sans"> ${ts}</span>`,
            fontfile: openSans,
            width: 1100,
            rgba: true,
          },
        },
        top: 508,
        left: 64,
      },
    ])
    .png()
    .toBuffer({ resolveWithObject: true });

  response.status(200);
  response.setHeader("content-type", "image/png");
  response.setHeader("content-length", s.info.size);

  // https://vercel.com/docs/concepts/edge-network/caching#serverless-functions-(lambdas)
  // fresh for 5 min (in case of changes), swr with 5 hours
  response.setHeader(
    "Cache-Control",
    `s-maxage=300, stale-while-revalidate=18000`
  );

  response.write(s.data);
  response.end();
};

export default createOpenGraphImage;
