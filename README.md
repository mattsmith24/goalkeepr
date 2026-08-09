## Developing

Svelte commands used to create this:

```sh
# recreate this project
npx sv@0.15.3 create --template minimal --types ts --add prettier eslint vitest="usages:unit" playwright tailwindcss="plugins:none" sveltekit-adapter="adapter:node" drizzle="database:sqlite+sqlite:better-sqlite3" better-auth="demo:github" storybook --install npm fail-again
```

Install dependencies with `npm install` (or `pnpm install` or `yarn`)

Create .env file.

```sh
cp .env.example .env
vim .env
```

Create database:

```sh
npm run db:push
```

start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Storybook

Design components with Storybook

```sh
npm run storybook
```

### Testing

Three kinds of tests, all driven by `npm run test`:

- **Unit (server)** — Vitest in Node, runs `*.{test,spec}.{js,ts}` excluding Svelte component tests.
- **Component / Storybook interaction** — Vitest in a real browser, drives the `play` functions on stories. Also a "test" of the component's rendering and accessibility.
- **E2E** — Playwright, drives the full app via a browser.

The two browser-based suites need Playwright's Chromium installed. `npm run test:e2e` installs it automatically the first time, but you can also run it on its own:

```sh
npx playwright install chromium
```

Run them individually:

```sh
npm run test:unit    # unit + storybook interaction tests
npm run test:e2e     # e2e (also runs `playwright install` first)
npm run test         # both, sequentially
```

## Building

Assuming node_adapter is the deployment method.

To create a production version:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

## Deploying

Make a user `goalkeepr` with the "no-login" options with home directory /home/goalkeepr

Install nvm:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | sudo -u goalkeepr bash
```

On a Digital Ocean Droplet, might need swap:

```sh
# Source - https://stackoverflow.com/a/45921532
# Posted by Yuriy Korman
# Retrieved 2026-08-09, License - CC BY-SA 3.0

  sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=1024
  sudo /sbin/mkswap /var/swap.1
  sudo /sbin/swapon /var/swap.1
```

Copy the build directory and package*.json to the server.

```sh
rsync -av --exclude .env --exclude node_modules --exclude local.db * $SERVER:/home/goalkeepr/
```

Install dependencies

```sh
npm ci --omit dev
```

Init the DB

```sh
npm run db:push
```

Create .env using .env.example as the template.

Run it to see what errors you get

```sh
node --env-file=.env build
```

