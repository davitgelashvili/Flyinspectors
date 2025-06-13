import { useTranslation } from "react-i18next";
// import ContactList from "../../Pages/Contact Us/Contact Us Section/ContactList";
import styles from "./ContactSubmitPage.module.scss";

const ContactSubmitPage = () => {
  const {t} = useTranslation()
  return (
    <div className={styles.mainDiv}>
      <h3 className={styles.header}>
          {t('submitForm.contacttitle')}
      </h3>
      <div className={styles.item}>
        <div className="row">
          {/* <ContactList /> */}
        </div>
        {/* <h4><img src="https://res.cloudinary.com/dluqxr8lw/image/upload/v1733343121/ic_location_on_24px_w7dlic.png" alt="icon" /> 363 CHAPTER ROAD, LONDON, ENGLAND, NW2 ND5</h4>
        <br></br>
        <h4><img src="https://res.cloudinary.com/dluqxr8lw/image/upload/v1733343121/ic_call_24px_1_nbfctc.png" alt="icon" />  +995 0322 19 53 29</h4>
        <br></br>
        <h4><img src="https://res.cloudinary.com/dluqxr8lw/image/upload/v1733343121/ic_markunread_24px_1_qdrddk.png" alt="icon" />  info@flyinspectors.com</h4>
        <br></br> */}
      </div>
    </div>
  );
};

export default ContactSubmitPage;
