import { readFile, writeFile } from "node:fs/promises";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

export const majorPages = [
  {
    path: "/",
    title: "Home",
    description:
      "About Siddarth Gundu, social links, featured projects, writing, and community work.",
  },
  {
    path: "/experience/",
    title: "Work",
    description:
      "Engineering work at Runable, CNCF, Tower, and The Linux Foundation.",
  },
  {
    path: "/projects/",
    title: "Projects",
    description:
      "Projects and experiments across infrastructure, compilers, AI, and developer tooling.",
  },
  {
    path: "/blogs/",
    title: "Writing",
    description:
      "Published articles on systems, open source, infrastructure, and personal experiences.",
  },
  {
    path: "/opensource-log/",
    title: "Open Source Log",
    description:
      "A running log of open source patches, pull requests, and contributions.",
  },
  {
    path: "/reads/",
    title: "Reads",
    description:
      "A collection of books, articles, and videos; some books are still in progress.",
  },
];

/** @param {string} pathname */
export const markdownPath = (pathname) =>
  `${pathname.replace(/\/$/, "")}/index.md`;

/** @param {string} pathname */
export const hasMarkdownPage = (pathname) =>
  majorPages.some((page) => page.path === pathname) ||
  /^\/blogs\/.+\/$/.test(pathname);

/**
 * Convert the rendered page so HTML and Markdown always share one source.
 * @param {string} html
 * @param {string} canonical
 */
export const pageToMarkdown = (html, canonical) => {
  const converter = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  converter.use(gfm);
  converter.remove([
    "head",
    "title",
    "nav",
    "footer",
    "script",
    "style",
    "button",
    "svg",
  ]);
  converter.addRule("absoluteLinks", {
    filter: "a",
    replacement: (content, node) => {
      const href = node.getAttribute("href");
      if (!href) return content;
      const url = new URL(href, canonical).href;
      if (node.classList.contains("socials__link")) {
        return `\n- [${node.textContent.trim()}](<${url}>)\n`;
      }
      // Project and writing cards wrap block content in an anchor. Put the
      // link on their heading instead of emitting invalid multiline links.
      if (/\n/.test(content.trim())) {
        const linked = content
          .trim()
          .replace(
            /^(#{1,6}) (.+)$/m,
            (_heading, level, title) => `${level} [${title}](<${url}>)`,
          );
        return `\n\n${linked}${linked === content.trim() ? `\n\n[Source](<${url}>)` : ""}\n\n`;
      }
      return `[${content}](<${url}>)`;
    },
  });
  converter.addRule("absoluteImages", {
    filter: "img",
    replacement: (_content, node) => {
      const src = node.getAttribute("src");
      const alt = (node.getAttribute("alt") ?? "").replace(/[\[\]\\]/g, "\\$&");
      return src ? `![${alt}](<${new URL(src, canonical).href}>)` : "";
    },
  });
  const markdown = converter.turndown(html).trim();
  return `${markdown.replace(/^(# .+)$/m, `$1\n\nCanonical page: ${canonical}`)}\n`;
};

/** @returns {import("astro").AstroIntegration} */
export default function markdownPages() {
  let site;
  return {
    name: "markdown-pages",
    hooks: {
      "astro:config:done": ({ config }) => {
        if (!config.site)
          throw new Error("Markdown pages require a configured site URL.");
        site = config.site;
      },
      "astro:build:done": async ({ dir, pages, logger }) => {
        const documents = await Promise.all(
          pages.map(async ({ pathname }) => {
            const path = `/${pathname.replace(/^\/+|\/+$/g, "")}/`.replace(
              /^\/\//,
              "/",
            );
            if (!hasMarkdownPage(path)) return null;
            const outputPath = markdownPath(path).slice(1);
            const html = await readFile(
              new URL(outputPath.replace(/\.md$/, ".html"), dir),
              "utf8",
            );
            const markdown = pageToMarkdown(html, new URL(path, site).href);
            await writeFile(new URL(outputPath, dir), markdown);
            return {
              path,
              url: new URL(markdownPath(path), site).href,
              title: markdown.match(/^# (.+)$/m)?.[1] ?? path,
            };
          }),
        );
        const published = documents.filter(Boolean);
        const link = (title, url, description) =>
          `- [${title}](${url}): ${description}`;
        const majorLinks = majorPages.map((page) => {
          const document = published.find((entry) => entry.path === page.path);
          if (!document) throw new Error(`Missing Markdown page: ${page.path}`);
          return link(page.title, document.url, page.description);
        });
        const articles = published
          .filter(
            (entry) =>
              entry.path.startsWith("/blogs/") && entry.path !== "/blogs/",
          )
          .sort((a, b) => a.path.localeCompare(b.path));
        const index = [
          "# Siddarth Gundu",
          "> Personal portfolio, engineering work, projects, writing, open source contributions, and reading list.",
          "The links below provide Markdown versions of the published pages. Each file links to its canonical HTML page. External articles remain on their original publishers' sites.",
          "## Main pages",
          majorLinks.join("\n"),
          ...(articles.length
            ? [
                "## Articles",
                articles
                  .map((article) =>
                    link(article.title, article.url, "Full published article."),
                  )
                  .join("\n"),
              ]
            : []),
        ].join("\n\n");
        await writeFile(new URL("llms.txt", dir), `${index}\n`);
        logger.info(
          `Generated llms.txt and ${published.length} Markdown pages.`,
        );
      },
    },
  };
}
