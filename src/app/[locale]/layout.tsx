import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-jp",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://minforge.dev";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ja";
  const dict = await getDictionary(locale);

  const languages = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}/${l}`]),
  );

  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { ...languages, "x-default": `${SITE_URL}/${defaultLocale}` },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${SITE_URL}/${locale}`,
      siteName: "Takumi Ishii",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/og/og-default.jpg",
          width: 1200,
          height: 630,
          alt: dict.meta.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/images/og/og-default.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoSansJP.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <Header dict={dict} locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer dict={dict} locale={locale} />
      </body>
    </html>
  );
}
