# What's built — Next.js version

A port of the static `index.html` guild site to **Next.js 16** (App Router +
TypeScript). The app lives in `my-app/`. Everything below is implemented and
verified (clean `npm run build`, clean `npm run lint`, server-rendered page +
API probed).

## Pages & navigation

- **Single-page shell** styled as a terminal/CRT window (the pink theme,
  scanline overlay, traffic-light dots, `~/guild` path).
- **Four tabs** with client-side switching: **Home**, **FAQ**, **Apply**,
  **Gallery**.
- **Deep linking** via URL hash — e.g. `/#apply` opens the Apply tab; browser
  back/forward and manual hash edits stay in sync.
- Discord button in the nav and footer, plus footer quick-links.

## Home

- Big banner text + tagline.
- Three feature cards.
- "Apply to join" (jumps to the Apply tab) and "Join our Discord" buttons.

## FAQ

- Six expandable accordion entries (native `<details>`), editable in
  `page.tsx`.

## Apply (multi-step wizard)

- 8 question steps → review screen → submit, with a progress bar.
- Steps: in-game name, Discord username + User ID, about you, why you'd be a
  great addition, hacked-clients (dropdown), play activity, why you want to join.
- **Per-step validation**: required fields, and the Discord ID must be 15–25
  digits.
- **Review screen** lists every answer before sending.
- **Submit** posts to `/api/apply`; shows a success screen (with Discord link)
  or an error screen with a retry button.
- **Honeypot** hidden field — bot submissions are silently dropped.
- Enter key advances steps; first field of each step auto-focuses.

## Gallery

- Image slideshow: prev/next arrows, dot indicators, arrow-key navigation,
  auto-advance every 5s while visible.
- Shows a friendly placeholder when no photos are configured (current default).

## API — `POST /api/apply`

- Reads the Discord webhook from the `DISCORD_WEBHOOK_URL` env var
  (server-side only, never exposed to the browser).
- Validates required fields and the Discord ID format.
- Posts the application to Discord as a **formatted embed**.
- Posts a native **Accept / Reject poll** (48-hour duration) so members vote.
- Returns JSON: `{ ok: true }`, or an error with the right HTTP status
  (`500` if no webhook, `400` bad input, `502` if Discord rejects).
- Honeypot submissions return `{ ok: true }` without posting.

## Configuration — `src/config.ts`

One place to edit:

- `GUILD` — name shown in nav, footer, FAQ, browser tab.
- `BANNER` — large home banner text.
- `DISCORD` — invite link used by all Discord buttons.
- `PHOTOS` — gallery image list (empty by default).
- `LABELS` — field labels shown on the review screen.

Theme colors live in the `:root` CSS variables at the top of
`src/app/globals.css`.

## Tech notes

- Next.js 16 App Router, TypeScript, React 19.
- Fonts (JetBrains Mono + VT323) loaded via `next/font` — self-hosted, no
  layout shift.
- `@/*` import alias maps to `my-app/src/*`.

## How it works (the flow)

1. **Page load** — `layout.tsx` loads the fonts and theme, then renders
   `page.tsx`. The page reads the URL hash (e.g. `#apply`) and opens the
   matching tab; with no hash it defaults to Home.

2. **Switching tabs** — clicking a tab updates React state and rewrites the
   URL hash (no full page reload). Only the active tab's section is rendered.

3. **Filling out the form** — `ApplyWizard.tsx` holds all answers in component
   state. Clicking **Next** validates just the current step (required fields,
   and the Discord ID digit check) before advancing; **Back** returns without
   re-validating. The progress bar reflects how far along you are.

4. **Submitting** — the review screen shows every answer. On **Submit**, the
   browser sends a `POST` with the form data as JSON to `/api/apply` on the
   same domain.

5. **Server relay** — `api/apply/route.ts` runs on the server. It checks the
   honeypot, validates the fields, then makes two calls to the Discord webhook:
   one to post the application embed, one to post the Accept/Reject poll. The
   webhook URL stays on the server and is read from `DISCORD_WEBHOOK_URL`.

6. **Result** — the route replies with JSON. The wizard shows the success
   screen (with a Discord invite link) on `ok`, or the error screen with a
   retry button if the request failed.

7. **In Discord** — your members see the embed + poll and vote natively over
   48 hours. Accepting someone (assigning the role) is still a manual step.

Why the webhook is server-side: if it lived in the browser, anyone could read
it from the page source and spam your channel. Routing through `/api/apply`
keeps it hidden.

## Not yet done

- No Discord webhook is wired up by default — set `DISCORD_WEBHOOK_URL` in
  `.env.local` to enable real submissions.
- Gallery has no photos configured.
- Carried over from the original site's TODO list (not implemented here):
  RealmEye verification step, updated flavor text, and a style-design review.
