// src/app/api/apply/route.ts
// Next.js route handler. Receives the application from the apply form,
// posts it into Discord as a formatted embed, then drops a native poll
// ("Accept this applicant?") that your members vote on.
//
// SETUP (one time):
//   Set the DISCORD_WEBHOOK_URL environment variable to the webhook URL for
//   your recruitment channel (Channel → Edit → Integrations → Webhooks → New).
//   Locally, put it in .env.local. In production, set it in your host's env.
//   Do NOT put the URL in code or in the front-end.

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return json({ error: "Server not configured" }, 500);

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Bad request" }, 400);
  }

  // honeypot: bots fill hidden fields — silently accept and drop
  if (data.website) return json({ ok: true });

  // basic validation
  for (const f of ["ign", "discord_username", "discord_id", "about", "value", "why"]) {
    if (!data[f] || !String(data[f]).trim()) return json({ error: `Missing ${f}` }, 400);
  }
  if (!/^\d{15,25}$/.test(String(data.discord_id).trim())) {
    return json({ error: "Invalid Discord ID" }, 400);
  }

  const v = (k: string, max = 1024) => String(data[k] ?? "—").slice(0, max);
  const ign = v("ign", 60);

  // 1) post the application as an embed
  const embed = {
    title: `📥 New application — ${ign}`,
    color: 0x9d1111,
    fields: [
      { name: "In-game name", value: ign, inline: true },
      {
        name: "Discord",
        value: `${v("discord_username", 40)}\n\`${v("discord_id", 25)}\` (<@${v("discord_id", 25)}>)`,
        inline: true,
      },
      { name: "Hacked clients?", value: v("hacked", 60), inline: true },
      { name: "Plays", value: v("activity", 120) },
      { name: "About them", value: v("about") },
      { name: "Why they'd be a great addition", value: v("value") },
      { name: "Why they want to join", value: v("why") },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: "submitted via the apply form" },
  };

  const embedRes = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed], allowed_mentions: { parse: [] } }),
  });
  if (!embedRes.ok) return json({ error: "Discord rejected the post" }, 502);

  // 2) post the vote poll (separate message so it sits right under the application)
  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      poll: {
        question: { text: `Accept ${ign} into the guild?`.slice(0, 300) },
        answers: [
          { poll_media: { text: "Accept", emoji: { name: "✅" } } },
          { poll_media: { text: "Reject", emoji: { name: "❌" } } },
        ],
        duration: 48, // hours the poll stays open (max 768 = 32 days)
        allow_multiselect: false,
      },
    }),
  });

  return json({ ok: true });
}

function json(obj: unknown, status = 200) {
  return NextResponse.json(obj, { status });
}
