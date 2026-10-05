import { LOCALES, DEFAULT_LOCALE } from "@/i18n/locales";
import Faq from "./Faq";

// FAQ გვერდი: ყველა კითხვა ბაზიდან (ადმინი → ხშირად დასმული კითხვები).
function FaqPage({ lang }) {
  const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;

  return (
    <div>
      <Faq locale={locale} />
    </div>
  );
}

export default FaqPage;
