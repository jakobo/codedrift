const chromium = require("chrome-aws-lambda");

const isDev = !process.env.AWS_REGION;
const base = isDev
  ? "http://localhost:3000/thunked/og"
  : "https://codedrift.com/thunked/og";
const fileType = "png";

const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// based on logic from https://github.com/creativecommons/og-image-generator/blob/main/api/_lib/chromium.ts
const getChromiumOptions = async (devMode) => {
  if (devMode) {
    return {
      args: [],
      executablePath: exePath,
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

const errorWith = (e, res) => {
  console.error(e);
  res.statusCode = 500;
  res.end("Unable to generate image");
};

const timeout = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// og:image slug for thunked
export default async function (req, res) {
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
    await page.goto(url, { waitUntil: "networkidle2" });
    await timeout(500); // ensure react inits on next.js page

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
  res.setHeader(
    "Cache-Control",
    `public, no-transform, s-maxage=604800, max-age=604800`
  );
  res.end(file);
}
