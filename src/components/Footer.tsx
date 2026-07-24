import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import ObfuscatedEmail from "./ObfuscatedEmail";

export default function Footer({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-[var(--color-text-faint)]">
          &copy; {year} {locale === "ja" ? "石井拓実" : "Takumi Ishii"}. {dict.footer.rights}
        </p>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <span>{dict.footer.emailLabel}:</span>
          <ObfuscatedEmail />
        </div>
      </div>
    </footer>
  );
}
