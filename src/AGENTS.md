# Source Guide

Use this guide for changes under `src`.

## Routes And Layout

- Keep shared navigation and theme behavior in `src/layouts/Layout.astro`, `src/components/SiteNav.astro`, and `src/components/ui/ThemeToggle.astro`.
- Use `src/util/url.ts` for links that need to respect Astro's configured base path, external URL detection, or hostname labels.
- Keep page-specific prose and section order inside the route file that renders it.

## Components

- Astro components are preferred for static UI and route composition.
- React components are only used for client-side behavior that needs hydration, such as `ReadsList` and `CommunityGrid`.
- Keep class names stable when refactoring shared styles because most visual behavior lives in `src/styles/global.css`.

## Data And Utilities

- Put reusable data in `src/constants`.
- Keep one-off route data in the route file instead of creating a new constants module.
- Put browser/server helpers in `src/util`.
- Keep scripts idempotent across Astro view transitions because they can survive client-side navigation.

## Content Collection Notes

- Do not place agent docs directly under `src/content`; Astro treats Markdown there as collection input.
- Add local blog posts under `src/content/blog` with frontmatter that matches `src/content/config.ts`.
- Use `draft: true` when a post should stay out of listings and generated routes.
