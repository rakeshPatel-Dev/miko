export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const siteName = "Miko";

export const siteDescription =
  "A tiny, playful bookmark companion for saving the good stuff from the internet.";
