'use client'

import styles from "./ContactUs.module.scss";
import image from "../../../components/Images/PicOfSupport.png";
import SectionCover from "../../../components/SectionTextAndCover/SectionCover.js";
import SectionText from "../../../components/SectionTextAndCover/SectionText.js";
import { useTranslation } from "react-i18next";
import ContactList from "./ContactList.js";

const ContactUsSection = ({ contact }) => {
  const {t} = useTranslation()
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <div className="row">
          <div className="col-lg-5 col-12">
            <SectionCover image={image} />
          </div>
          <div className={`col-lg-7 col-12`}>
            <SectionText title={t('ContactUs.sectionTitle')}>
              <div className="row">
                <ContactList contact={contact} />
              </div>
            </SectionText>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsSection;
