/** Public site URL — used for absolute Open Graph / Twitter image URLs when sharing. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  // Vercel sets this automatically on each deployment
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export const SITE_NAME = "Unsmoke";
export const SITE_DESCRIPTION =
  "Quit smoking and vaping — track your smoke-free journey, milestones, and cravings on your device.";
