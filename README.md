# Paykit landing page

A public Paykit landing page built with Next.js 16 App Router, React, and TypeScript for Vercel. Research and source checks are in [docs/research.md](docs/research.md).

Production URL: [paykit-landing-page.vercel.app](https://paykit-landing-page.vercel.app).

The design uses graphite surfaces, Geist typography, serif title accents, and orange highlights. The introduction includes a click-to-load video. The five-state payment animation explains payment options, registration, choosing a contact, discovering a shared rail, and direct wallet payment. Its copy and profiles stay in server components; the client controller handles playback. Visitors can select steps or pause. Autoplay runs while the scene is visible and respects reduced-motion preferences.

## Run locally

Use Node.js 22 or newer. No environment variables or preview password are required.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. For a production run:

```sh
npm run build
npm start
```

## Checks

```sh
npm test
npm run typecheck
npm run build
npm run test:browser
```

Install Chromium with `npx playwright install chromium` if needed. Browser checks start the production server automatically after a build. Set `PLAYWRIGHT_BASE_URL` to test an existing deployment. Tests cover anonymous access, sharing metadata, calendar downloads, desktop/mobile layout, the payment animation, click-to-load video, and the email-draft composer.

## Deploy on Vercel

Import this repository using the Next.js framework preset, or deploy using `npx vercel --prod`. The existing Vercel project's verified production domain is `paykit-landing-page.vercel.app`. Automatic Git deployments are not connected, so use the CLI unless that integration is enabled.

The temporary password gate and its login/session endpoints have been removed. Public pages allow indexing. CSP, MIME sniffing protection, framing restrictions, and the other security headers remain configured in `next.config.ts`.

## Media and visitor actions

The introductory video is [Paykit on YouTube](https://www.youtube.com/watch?v=cQi8QkG_y4Y). Its official thumbnail is stored locally; the `youtube-nocookie.com` player loads only after the visitor chooses to watch.

The contact form creates an email draft to `info@synonym.to` in the visitor's mail app. It does not submit or store leads on this server. Review [Synonym's terms](https://synonym.to/terms-of-service) for linked contact/privacy information.

The Pubky Market link uses the supplied staging address, which may require separate access. Update it when a public destination is available.

The Lugano workshop includes Google Calendar and a public `.ics` download with a thirty-minute reminder. Both use 24 October 2026, 14:15–15:00 UTC (16:15–17:00 CEST in Lugano).

Sharing previews use the Paykit wordmark and a generated network globe. Regenerate the card with `node scripts/render-social-preview.mjs`. Generated artwork provenance is recorded under [docs/design](docs/design), with earlier prompts in [docs/illustration-prompts.md](docs/illustration-prompts.md). Previous animation assets and [rollback instructions](docs/illustration-rollback.md) are preserved.
