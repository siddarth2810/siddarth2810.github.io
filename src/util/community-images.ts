import { readdir } from "node:fs/promises";
import path from "node:path";

const COMMUNITY_DIR = path.join(process.cwd(), "public", "community");
const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);

interface CommunityImage {
  src: string;
  alt: string;
}

function toAltText(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getCommunityImages(): Promise<CommunityImage[]> {
  try {
    const entries = await readdir(COMMUNITY_DIR, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile())
      .filter((entry) =>
        IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      )
      .map((entry) => ({
        src: `/community/${entry.name}`,
        alt: toAltText(entry.name) || "Community image",
      }));
  } catch {
    return [];
  }
}
