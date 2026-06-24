import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imageRoots = ["src/assets", "public"];
const sourceFiles = [
  "src/data/projects.js",
  "src/sections/Hero.jsx",
  "src/sections/CVProfile.jsx",
];
const imageExtensions = new Set([".png", ".jpg", ".jpeg"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function toWebpPath(file) {
  return path.join(path.dirname(file), `${path.basename(file, path.extname(file))}.webp`);
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const files = (
  await Promise.all(
    imageRoots.map((dir) => walk(path.join(root, dir)))
  )
).flat();

let originalBytes = 0;
let webpBytes = 0;

for (const file of files) {
  const output = toWebpPath(file);
  const inputStat = await fs.stat(file);
  originalBytes += inputStat.size;

  await sharp(file)
    .rotate()
    .webp({ quality: 78, effort: 6 })
    .toFile(output);

  const outputStat = await fs.stat(output);
  webpBytes += outputStat.size;
}

for (const relativeFile of sourceFiles) {
  const file = path.join(root, relativeFile);
  let content = await fs.readFile(file, "utf8");
  content = content
    .replace(/\.(png|jpe?g)(["'])/gi, ".webp$2")
    .replace(/\/profile\.webp/g, "/profile.webp")
    .replace(/\/Quddous_CV\.webp/g, "/Quddous_CV.webp");
  await fs.writeFile(file, content, "utf8");
}

console.log(`Converted ${files.length} images to WebP.`);
console.log(`Original total: ${formatBytes(originalBytes)}`);
console.log(`WebP total: ${formatBytes(webpBytes)}`);
console.log(`Saved: ${formatBytes(originalBytes - webpBytes)}`);
