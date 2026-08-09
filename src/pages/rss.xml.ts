import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { getPostSummary, sortPostsByDate } from "../util/blog";

export async function GET(context: APIContext) {
  const posts = sortPostsByDate(
    await getCollection("blog", (post: CollectionEntry<"blog">) => !post.data.draft),
  );

  return rss({
    title: "Siddarth Gundu — Writing",
    description: "Notes on systems, open source, infrastructure.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: getPostSummary(post),
      pubDate: post.data.pubDate,
      link: `/blogs/${post.slug}/`,
    })),
  });
}
