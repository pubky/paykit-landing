import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

// Fixed local inputs keep this render independent of the app and external services.
const globeUrl = new URL("../public/illustrations/social-network-globe-v1.png", import.meta.url);
const outputUrl = new URL("../public/social-preview-v3.png", import.meta.url);
const globe = (await readFile(globeUrl)).toString("base64");
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  await page.route("**/*", (route) => route.abort());
  await page.setContent(`<!doctype html>
    <html lang="en"><head><meta charset="utf-8"><style>
      * { box-sizing: border-box; }
      html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
      body { background: #090b10; color: #f5f6fa; font-family: Arial, sans-serif; }
      .card { position: relative; width: 1200px; height: 630px; overflow: hidden;
        background: radial-gradient(ellipse at 82% 50%, #ff6b3d08, transparent 48%), #090b10; }
      .globe { position: absolute; width: 500px; height: 500px; right: 18px; top: 65px;
        object-fit: contain; opacity: .9; }
      .copy { position: absolute; top: 202px; left: 72px; width: 610px; z-index: 1; }
      h1 { margin: 0; font-size: 108px; line-height: 1.05; font-weight: 600;
        letter-spacing: -5px; }
      .tagline { margin: 24px 0 0 6px; max-width: 540px; color: #c1c7d2;
        font-family: Georgia, serif; font-style: italic; font-size: 32px; line-height: 1.35; }
    </style></head><body><main class="card">
      <img class="globe" alt="" src="data:image/png;base64,${globe}">
      <div class="copy">
        <h1>Paykit</h1>
        <p class="tagline">The open payment coordination protocol</p>
      </div>
    </main></body></html>`, { waitUntil: "load" });
  await page.locator("img").evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
  await page.evaluate(() => document.fonts.ready);
  const copyBounds = await page.locator(".copy").boundingBox();
  if (!copyBounds || copyBounds.x + copyBounds.width > 1136 || copyBounds.y + copyBounds.height > 566) {
    throw new Error("Social preview copy exceeds its safe bounds.");
  }
  await mkdir(new URL("../public/", import.meta.url), { recursive: true });
  await page.screenshot({ path: fileURLToPath(outputUrl), type: "png", animations: "disabled" });
  console.log(`Rendered ${fileURLToPath(outputUrl)} (1200 × 630).`);
} finally {
  await browser.close();
}
