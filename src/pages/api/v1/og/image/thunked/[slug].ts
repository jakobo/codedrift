import { NextApiRequest, NextApiResponse } from "next";

// leave as require for lambda compat
// importing this does very-bad-things in vercel
const chromium = require("chrome-aws-lambda");

const isDev = process.env.NODE_ENV !== "production";
const base = `${process.env.NEXT_PUBLIC_URL}/og/image/thunked`;
const fileType = "png";

// based on logic from https://github.com/creativecommons/og-image-generator/blob/main/api/_lib/chromium.ts
const getChromiumOptions = async (devMode) => {
  if (devMode) {
    return {
      args: [],
      executablePath:
        process.platform === "win32"
          ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
          : process.platform === "linux"
          ? "/usr/bin/google-chrome"
          : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: true,
    };
  } else {
    return {
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    };
  }
};

const errorWith = (e: any, res: NextApiResponse) => {
  console.error(e);
  res.statusCode = 500;
  res.end("Unable to generate image");
};

// og:image slug for thunked
export default async function (req: NextApiRequest, res: NextApiResponse) {
  let file = null;
  let browser = null;

  try {
    console.log("Getting browser");
    const options = await getChromiumOptions(isDev);
    browser = await chromium.puppeteer.launch(options);

    console.log("Creating page");
    const page = await browser.newPage();
    page.setViewport({ width: 1200, height: 600 });

    const url = `${base}/${req.query.slug}`;
    console.log(`Requesting: ${url}`);
    await page.goto(url);
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
