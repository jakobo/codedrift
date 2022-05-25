import { NextApiRequest, NextApiResponse } from "next";
import core from "puppeteer-core";
import chrome from "chrome-aws-lambda";

// raw exe path in development
const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const isDev = process.env.NODE_ENV !== "production";
const base = `${process.env.NEXT_PUBLIC_URL}/thunked/og`;
const fileType = "png";

interface Options {
  args: string[];
  executablePath: string;
  headless: boolean;
}

const getOptions = async (isDev: boolean): Promise<Options> => {
  let options: Options;
  if (isDev) {
    options = {
      // uncomment to get io dumps in development
      // dumpio: true,
      args: [
        "--single-process",
        "--no-sandbox",
        "--disable-software-rasterizer",
        "--disable-dev-shm-usage",
        "--remote-debugging-port=9222",
        "--mute-audio",
        "--disable-gpu",
      ],
      executablePath: exePath,
      headless: true,
    };
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }
  return options;
};

const errorWith = (e: any, res: NextApiResponse) => {
  console.error(e);
  res.statusCode = 500;
  res.end("Unable to generate image");
};

let _page: core.Page | null = null;

const getPage = async (isDev: boolean): Promise<core.Page> => {
  if (_page) {
    return _page;
  }
  const options = await getOptions(isDev);
  console.log("Options", options);
  const browser = await core.launch(options);
  console.log("newPage");
  const page = await browser.newPage();
  console.log("Saving");
  return page;
};

// og:image slug for thunked
export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let file = null;
  let browser = null;
  const url = `${base}/${req.query.slug}`;

  try {
    console.log("Creating page");
    const page = await getPage(isDev);
    page.setViewport({ width: 1200, height: 600 });
    console.log(`Requesting: ${url}`);
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("#render-complete");
    console.log("Screenshotting");
    file = await page.screenshot({
      fullPage: true,
      type: fileType,
    });

    console.log("DONE");
  } catch (e) {
    return errorWith(e, res);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", `image/${fileType}`);
  // https://vercel.com/docs/concepts/edge-network/caching#serverless-functions-(lambdas)
  // fresh for 5 min (in case of changes), swr with 5 hours
  res.setHeader("Cache-Control", `s-maxage=300, stale-while-revalidate=18000`);
  res.end(file);
}
