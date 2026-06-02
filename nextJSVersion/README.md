# Guild apply form → Discord (Next.js version)

The same terminal/CRT guild site as the static `index.html` in the parent
folder, rebuilt as a **Next.js 16** App Router app (TypeScript). Home / FAQ /
Apply / Gallery tabs, a multi-step apply wizard, and an API route that posts
applications into Discord as an embed plus a native **Accept / Reject poll**.

The app lives in the `my-app/` subfolder:

```
nextJSVersion/my-app/
├── src/
│   ├── config.ts                 ← edit guild name, Discord invite, photos
│   ├── app/
│   │   ├── layout.tsx            ← fonts (next/font), metadata
│   │   ├── page.tsx              ← shell + tab routing (Home/FAQ/Apply/Gallery)
│   │   ├── globals.css           ← the CRT theme
│   │   └── api/apply/route.ts    ← serverless relay to Discord
│   └── components/
│       ├── ApplyWizard.tsx       ← the multi-step form
│       ├── Gallery.tsx           ← slideshow
│       └── DiscordIcon.tsx
└── .env.example
```

The `@/*` import alias maps to `my-app/src/*` (see `tsconfig.json`).

## Run locally

```bash
cd nextJSVersion/my-app
npm install
cp .env.example .env.local   # then paste your Discord webhook URL into it
npm run dev                  # http://localhost:3000
```

## 1. Make a Discord webhook

In Discord: your recruitment channel → **Edit Channel → Integrations →
Webhooks → New Webhook → Copy Webhook URL**. Put it in `.env.local`:

```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

The webhook URL stays server-side — it lives only in the API route, never in
the browser.

## 2. Configure the site

Edit `src/config.ts`:

```ts
export const CONFIG = {
  ENDPOINT: "/api/apply",
  GUILD: "Fmy",                         // nav brand / FAQ / tab title
  BANNER: "Family",                     // big home banner
  DISCORD: "https://discord.gg/your-invite",
};
```

- **Questions:** each apply step is an entry in the `STEPS` array in
  `src/components/ApplyWizard.tsx`. Add, remove, or reword freely. If you change
  a field `name`, update `LABELS` in `config.ts` and the field list in
  `src/app/api/apply/route.ts`.
- **Gallery:** drop image URLs into the `PHOTOS` list in `config.ts`.
- **Colors:** the `:root` CSS variables at the top of `globals.css`.

## 3. Deploy

Any Next.js host works (Vercel is the simplest — point it at the `my-app/`
directory as the project root). Set the `DISCORD_WEBHOOK_URL` environment
variable in your host's dashboard, then deploy. The apply route runs on the
default Node.js serverless runtime; to target Cloudflare instead, use
`@cloudflare/next-on-pages`.

## How voting works

- The poll is created by the webhook; Discord tallies votes natively.
- Bots/apps can't vote on Discord polls and a poll can't be edited after
  posting — fine here, since your members vote and you read the result.
- Accepting is still a human step (assign the role, etc.).

## Spam protection

A hidden honeypot field is included; submissions that fill it are silently
dropped both client- and server-side.
