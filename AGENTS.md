# Repository Guide

This is an Astro portfolio site using Astro pages, React islands, Tailwind, MDX content collections, and site-wide CSS variables.

## Commands

- `npm run dev` starts the local Astro dev server.
- `npm run build` runs `astro check` and then builds the static site.
- `npm run preview` serves the built output.

## Project Shape

- `src/pages` owns routes. Keep route templates thin and move reusable logic into `src/components`, `src/util`, or `src/constants`.
- `src/layouts/Layout.astro` owns global page chrome, the navbar shell, theme bootstrapping, and view transitions.
- `src/styles/global.css` owns design tokens and shared component styles. Prefer extending existing CSS variables over adding page-local color systems.
- `src/content/blog` contains filesystem-backed MDX posts. Do not hardcode new local posts in page code.
- `src/constants/blogs.json`, `src/constants/projects.json`, and `src/constants/socials.json` are data files for external writing, project cards, and social links.
- `public/community` is scanned automatically for community images by `src/util/community-images.ts`.

## Guardrails

- Do not edit `dist`, `node_modules`, `.astro`, or copied reference assets.
- Preserve the content collection flow for blogs: frontmatter in MDX, listing in `src/pages/blogs/index.astro`, and detail rendering in `src/pages/blogs/[...slug].astro`.
- Keep dark theme behavior compatible with Astro view transitions. The theme script must continue to handle `astro:before-swap`.
- Use existing fonts and palette tokens from `src/styles/global.css` unless the user explicitly asks for visual redesign.
- Prefer small, typed utilities over repeated inline snippets when adding paths, external links, dates, or content helpers.
