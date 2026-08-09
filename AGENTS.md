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
- Typography is a closed token system, also in `global.css`. One typeface (Satoshi), three sizes (`--text-lg` 20px for page titles, `--text-body` 16px, `--text-sm` 14px), and two weights (400 / 600). Headings are the same size as body text — hierarchy comes from weight, colour, and the hairline rule after a prose `h2`, never from size. The `.type-*` utilities are aliases onto those sizes and are kept for compatibility; several now resolve identically. See "Type tokens" in that file.
- Spacing is a nine-step 4px scale (`--s-1` … `--s-24`) in `global.css`. Use only those tokens. A gap that seems to need an off-scale value is a wrong gap, not a missing token.
- `src/content/blog` contains filesystem-backed MDX posts. Do not hardcode new local posts in page code.
- `src/constants/blogs.json`, `src/constants/projects.json`, and `src/constants/socials.json` are data files for external writing, project cards, and social links.
- `public/community` contains community images referenced by `src/components/CommunityGrid.tsx`.

## Guardrails

- Do not edit `dist`, `node_modules`, `.astro`, or copied reference assets.
- Preserve the content collection flow for blogs: frontmatter in MDX, listing in `src/pages/blogs/index.astro`, and detail rendering in `src/pages/blogs/[...slug].astro`.
- Keep dark theme behavior compatible with Astro view transitions. The theme script must continue to handle `astro:before-swap`.
- Use existing fonts and palette tokens from `src/styles/global.css` unless the user explicitly asks for visual redesign.
- Set type with a `.type-*` token, never with Tailwind `text-*`/`leading-*`/`font-*` sizing classes or a raw `font-size`. Only two weights exist (400 and 600) — for more emphasis, go bold or go muted, do not invent an intermediate weight or a fourth size. Type does not resize at breakpoints; only layout does.
- Do not reintroduce card chrome. Groups of things are separated by a `--rule` hairline, not by borders, fills, radii, shadows, or hover lifts. Prose measure is fixed at `--measure-prose` and must not grow with the viewport.
- Prefer small, typed utilities over repeated inline snippets when adding paths, external links, dates, or content helpers.
