# Guild apply form → Discord (with vote poll)

A single-page application form in a terminal/CRT style. On submit it posts the
application into your Discord recruitment channel as an embed, then adds a
native **Accept / Reject poll** your members vote on.

```
guild-apply/
├── index.html              ← the apply page (static)
└── functions/
    └── api/
        └── apply.js        ← serverless relay (Cloudflare Pages Function)
```

## 1. Make a Discord webhook
In Discord: your recruitment channel → **Edit Channel → Integrations →
Webhooks → New Webhook → Copy Webhook URL**.

## 2. Deploy (free, Cloudflare Pages)
1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**,
   pick the repo. No build command needed (it's static). Output dir: `/`.
3. After the first deploy, go to **Settings → Variables & Secrets** and add a
   **secret**:
   - Name: `DISCORD_WEBHOOK_URL`
   - Value: the webhook URL from step 1
4. Redeploy. The form posts to `/api/apply` automatically — same domain, so the
   webhook URL stays server-side and never touches the browser.

> Vercel works too: move `functions/api/apply.js` to `api/apply.js` and adjust
> slightly to Vercel's handler signature. Cloudflare Pages is the easier path.

## 3. Edit a few things
In `index.html`, near the bottom `<script>`:
```js
const CONFIG = {
  ENDPOINT: "/api/apply",
  GUILD:    "GUILD",                         // your guild name (shows in the banner)
  DISCORD:  "https://discord.gg/your-invite" // shown on the success screen
};
```
- **Banner / ASCII art:** the banner is styled text. If you want true ASCII art
  like the reference, generate it at a tool like patorjk.com's "Text to ASCII
  Art Generator", drop it in a `<pre>` in place of `<div class="banner">`.
- **Questions:** each step is a `<section class="step" data-step>` block — add,
  remove, or reword freely. If you change field `name`s, update `ALLOWED` and
  `LABELS` in the JS and the field list in `apply.js`.
- **Colors:** the `:root` CSS variables at the top (`--pink`, `--pink-hot`, …).

## How voting works
- The poll is created by the webhook; Discord tallies votes natively.
- Note: bots/apps can't vote on Discord polls and a poll can't be edited after
  posting — that's fine here, since your members vote and you read the result.
- Accepting is still a human step (assign the role, etc.). If you later want
  buttons that auto-assign a role + DM the applicant, that's the "Discord bot
  with interactions" upgrade — more setup, same hosting.

## Spam protection
A hidden honeypot field is included; submissions that fill it are silently
dropped both client- and server-side. For heavier abuse, add Cloudflare Turnstile.



Things to do while i have time.

1. In the application part, add a realmeye verification step. With code in Description. ( Check with puppy, they might be making theirown mrrealmeye)

2. Update the text on the site with Bubs new flavor text.

3. Review and question the some of the site style designs. Like "Your tagline here"