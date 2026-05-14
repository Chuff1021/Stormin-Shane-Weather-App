// Generate PNG icons from public/icon.svg at build time.
// Runs in `prebuild` so Vercel produces them on every deploy.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const here = dirname(new URL(import.meta.url).pathname);
const root = resolve(here, "..");
const svgPath = resolve(root, "public/icon.svg");
const outDir = resolve(root, "public");

const sizes = [
  { name: "icon-192.png", size: 192, padding: 0 },
  { name: "icon-512.png", size: 512, padding: 0 },
  { name: "icon-512-maskable.png", size: 512, padding: 60 },
  { name: "apple-touch-icon.png", size: 180, padding: 0 },
];

try {
  const sharp = (await import("sharp")).default;
  const svg = await readFile(svgPath);
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

  for (const { name, size, padding } of sizes) {
    const innerSize = size - padding * 2;
    const inner = await sharp(svg).resize(innerSize, innerSize).png().toBuffer();
    const composite = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 4, g: 6, b: 12, alpha: 1 },
      },
    })
      .composite([{ input: inner, top: padding, left: padding }])
      .png()
      .toBuffer();
    await writeFile(resolve(outDir, name), composite);
    console.log(`✓ ${name} (${size}x${size})`);
  }
} catch (err) {
  console.warn("[generate-icons] skipped:", err?.message || err);
}
