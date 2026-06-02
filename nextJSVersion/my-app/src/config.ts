// ============================================================
// CONFIG — edit these.
// ============================================================
export const CONFIG = {
  // The apply form posts here. This is the Next.js API route.
  ENDPOINT: "/api/apply",
  // Shown in the nav brand, footer, FAQ and browser tab.
  GUILD: "Fmy",
  // Large home banner text.
  BANNER: "Family",
  // Discord invite shown on the success screen and Discord buttons.
  DISCORD: "https://discord.gg/familyfun",
};

// Future-use photo slideshow. Each entry: { src, caption }.
// Leave empty and the Gallery tab shows a friendly placeholder.
export const PHOTOS: { src: string; caption?: string }[] = [
  // { src: "https://i.imgur.com/abc123.jpg", caption: "First guild clear" },
];

// The fields collected by the apply wizard, in display order.
export const LABELS: Record<string, string> = {
  ign: "In-game name",
  discord_username: "Discord username",
  discord_id: "Discord User ID",
  about: "About them",
  value: "Why they'd be great",
  hacked: "Hacked clients?",
  activity: "Plays",
  why: "Why they want to join",
};
