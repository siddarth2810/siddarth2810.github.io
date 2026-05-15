/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)"],
        satoshi: ["var(--font-body)"],
        serif: ["var(--font-heading)"],
        heading: ["var(--font-heading)"],
        "alt-heading": ["var(--font-alt-heading)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: "var(--color-primary)",
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        title: "var(--ink)",
      },
      backgroundImage: {
        dotted: "url('/assets/dotted.svg')",
      },
    },
  },
  plugins: [],
};
