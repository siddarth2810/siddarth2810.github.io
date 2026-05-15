import type { CollectionEntry } from "astro:content";

type BlogPost = CollectionEntry<"blog">;

const WORDS_PER_MINUTE = 220;

const plainText = (body: string) =>
  body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_[\]()~.-]/g, " ");

export const formatPostDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

export const getReadingTime = (post: Pick<BlogPost, "body">) => {
  const words = plainText(post.body).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

export const getPostSummary = (post: Pick<BlogPost, "body" | "data">) => {
  if (post.data.description) {
    return post.data.description;
  }

  const summary = plainText(post.body).replace(/\s+/g, " ").trim();
  return summary.length > 180 ? `${summary.slice(0, 177)}...` : summary;
};

export const sortPostsByDate = (posts: BlogPost[]) =>
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
