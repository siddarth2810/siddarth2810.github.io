// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";

export default defineConfig({
  integrations: [mdx(), tailwind(), react(), icon()],
  site: "https://siddarth2810.github.io",
  base: "/",
});
