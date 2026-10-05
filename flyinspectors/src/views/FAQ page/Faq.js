import { getFaqs } from "@/api/serverApi";
import FaqList from "@/components/Faq/FaqList";

// FAQ გვერდი: ყველა კითხვა ბაზიდან (მთავარზე მონიშვნისგან დამოუკიდებლად).
// სათაური აქ <h1>-ია, რადგან გვერდზე სხვა h1 არ არის.
const Faq = async ({ locale }) => {
    const faqs = await getFaqs();

    return <FaqList faqs={faqs} locale={locale} as="h1" />;
};

export default Faq;
