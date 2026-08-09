// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [mdx(), tailwind(), sitemap()],
  site: "https://siddarth2810.github.io",
  // Static hosts serve `/blogs/` directly but 301 `/blogs` to it. Emitting the
  // slash everywhere keeps internal navigation off the redirect path.
  trailingSlash: "always",
});
