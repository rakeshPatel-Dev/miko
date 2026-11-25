# Miko landing site

Marketing site for Miko, the tiny bookmark companion. Built with
[Next.js](https://nextjs.org) (App Router), Tailwind CSS, and Motion.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script          | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Production build         |
| `npm start`     | Serve the production app |
| `npm run lint`  | Run ESLint               |

## Environment

Copy `.env.example` to `.env.local` and set the public site URL:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

This value powers canonical URLs, `robots.txt`, and `sitemap.xml`. It
falls back to `http://localhost:3000` when unset, so set it for every
production environment.

## Deploying to Vercel

The site lives in `landing/`, so the Vercel project must use it as its
root:

1. Import the `rakeshPatel-Dev/miko` repository in Vercel.
2. Set **Root Directory** to `landing`.
3. Keep the detected framework as **Next.js**.
4. Add `NEXT_PUBLIC_SITE_URL` to the Production (and Preview, if
   wanted) environment variables.
5. Deploy.

`vercel.json` in this directory pins the framework, uses `npm ci` for
installs, and adds baseline security and font-cache headers. No other
build settings are required.

## Store links

Store URLs and CTA labels live in [`lib/landing.ts`](lib/landing.ts).

- **Firefox** is live and links to the Add-ons listing.

## Structure

- `app/` — layout, page, metadata routes, global styles
- `components/` — page sections, UI primitives, product previews
- `lib/` — shared content, helpers, and site config
