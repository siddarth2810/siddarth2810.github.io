# portfolio_v2

Personal portfolio site built with Astro + Tailwind + React islands.

## Development

- Install: `bun install`
- Dev: `bun run dev`
- Build: `bun run build`

## Markdown and llms.txt

The production build generates `/llms.txt` and an `index.md` beside each main
page: `/index.md`, `/experience/index.md` (Work), `/projects/index.md`,
`/blogs/index.md`, `/opensource-log/index.md`, and `/reads/index.md`.
Published local blog posts also get `/blogs/<slug>/index.md`; drafts are excluded
by the existing content collection flow.

`src/integrations/markdown.mjs` converts the rendered HTML, retaining article
text, links, images, code blocks, and tables while removing navigation and page
controls. Content changes are reflected automatically on the next build. Each
HTML page advertises its Markdown alternate and `/llms.txt` in its head. These
generated files are available with `npm run preview` and on the deployed static
site, rather than in the development server.

## Acknowledgements

This project is based on / heavily inspired by:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

| `npm run astro ...` | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Inspiration

[Lakshay Bhushan's portfolio](https://github.com/lakshaybhushan/lakshb.dev)
