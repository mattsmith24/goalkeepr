This project is aimed at recording personal goals, breaking them into tasks and milestones and recording progress.

It's a personal project in early-stage development

source control is with Jujutsu

technology:
- Svelte 5 with runes.
- Tailwind v4
- Drizzle + better-sqlite3 in local.db with schema in src/lib/server/db/
- @sveltejs/adapter-node

Conventions:
- UI components paired with .stories.svelte for storybook
- Tests: Vitest for unit, Playwright for e2e. Component testing with Storybook.
