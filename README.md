# Miko

A tiny, playful bookmark companion browser extension that saves the good stuff from the internet.

## Features

- Quick save current page with one click
- Keyboard shortcuts for instant saving
- Local-first storage (no account required)
- Search saved links
- Date-based organization
- Inline title editing and deletion

## Development

```bash
npm install
npm run dev
```

Load the `.output/chrome-mv3` folder as an unpacked extension in Chrome.

Use **Alt + Shift + S** to save the active page instantly.

## Build

```bash
npm run build
```

## Landing site

The marketing site lives in [`landing/`](landing/) and is ready to deploy
to Vercel with the project root set to `landing`. See
[`landing/README.md`](landing/README.md) for local setup, environment
variables, and deployment steps.
