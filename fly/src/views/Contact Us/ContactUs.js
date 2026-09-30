import { getOffices } from "@/api/serverApi";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/locales";
import ContactOffices from "./Contact Us Section/ContactOffices";
import FeedBackComp from "./Feedback Form/FeedBackComp";

// სერვერ კომპონენტია: ოფისები ბაზიდან იკითხება (ადმინი → საკონტაქტო), რიგი ადმინში განისაზღვრება.
async function ContactUs({ lang }) {
  const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
  const data = await getOffices();

  return (
    <>
      <ContactOffices offices={data?.offices} locale={locale} />
      <FeedBackComp />
    </>
  );
}

export default ContactUs;
