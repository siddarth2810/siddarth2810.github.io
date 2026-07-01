import type { CollectionEntry } from "astro:content";

type BlogPost = CollectionEntry<"blog">;

const WORDS_PER_MINUTE = 220;

type BlogTopWindow = Window & {
  __blogTopBound?: boolean;
  __blogTopCleanup?: () => void;
};

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

export const setupBlogTopButton = () => {
  const blogTopWindow = window as BlogTopWindow;

  const syncBlogTopButton = () => {
    blogTopWindow.__blogTopCleanup?.();
    blogTopWindow.__blogTopCleanup = undefined;

    const scrollButton = document.getElementById(
      "to-top-btn",
    ) as HTMLButtonElement | null;
    const targetHeader = document.getElementById("blog-hero");

    if (!scrollButton || !targetHeader) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        scrollButton.dataset.show = (!entry.isIntersecting).toString();
      });
    });

    const handleClick = () => {
      document.documentElement.scrollTo({ behavior: "smooth", top: 0 });
    };

    observer.observe(targetHeader);
    scrollButton.addEventListener("click", handleClick);

    blogTopWindow.__blogTopCleanup = () => {
      observer.disconnect();
      scrollButton.removeEventListener("click", handleClick);
    };
  };

  syncBlogTopButton();

  if (!blogTopWindow.__blogTopBound) {
    blogTopWindow.__blogTopBound = true;
    document.addEventListener("astro:page-load", syncBlogTopButton);
  }
};
