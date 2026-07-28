import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://minforge.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${SITE_URL}/${locale}`]),
  );

  // The site is a single page per locale; `/` only redirects, so it is not listed.
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === defaultLocale ? 1 : 0.8,
    alternates: {
      languages: { ...languages, "x-default": `${SITE_URL}/${defaultLocale}` },
    },
  }));
}
