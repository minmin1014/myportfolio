import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Works from "@/components/Works";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero dict={dict} />
      <About dict={dict} />
      <Works dict={dict} />
      <Skills dict={dict} />
      <Contact dict={dict} />
    </>
  );
}
