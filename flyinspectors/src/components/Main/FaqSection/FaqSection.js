import { getFaqs } from "@/api/serverApi";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/locales";
import FaqList from "@/components/Faq/FaqList";

// მთავარი გვერდის FAQ: მხოლოდ ის კითხვები, რომლებიც ადმინში "მთავარ გვერდზე"-ა მონიშნული.
// სერვერ კომპონენტია — ტექსტი მზა HTML-შია (იხ. components/Faq/FaqList.js). კითხვის გარეშე
// სექცია არ ჩანს.
const FaqSection = async ({ lang }) => {
  const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
  const faqs = await getFaqs({ home: true });

  return <FaqList faqs={faqs} locale={locale} />;
};

export default FaqSection;
