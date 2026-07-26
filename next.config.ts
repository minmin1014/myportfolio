import type { NextConfig } from "next";

// Extra origins allowed by `next dev` (e.g. a LAN or Tailscale IP), supplied via
// env so no internal address is committed. Comma-separated; unset in production.
const devAllowedOrigins = (process.env.DEV_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  output: "standalone",
  ...(devAllowedOrigins.length > 0
    ? { allowedDevOrigins: devAllowedOrigins }
    : {}),
};

export default nextConfig;
