import ContactUsSection from "./Contact Us Section/ContactUsSection";
import FeedBackComp from "./Feedback Form/FeedBackComp";
import { getContactList } from "@/api/serverApi";

async function ContactUs() {
  const contact = await getContactList();

  return (
    <>
      <ContactUsSection contact={contact} />
      <FeedBackComp />
    </>
  );
}

export default ContactUs;
