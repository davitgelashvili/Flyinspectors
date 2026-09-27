'use client'

import styles from "./AboutUsSection.module.scss";
import image from "../../../components/Images/FlightAppPic.png";
import SectionCover from "../../../components/SectionTextAndCover/SectionCover.js";
import SectionText from "../../../components/SectionTextAndCover/SectionText.js";
import { useTranslation } from "react-i18next";

const AboutUsSection = () => {
  const {t} = useTranslation()
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <div className="row">
          <div className="col-lg-6 col-12">
            <SectionCover image={image} />
          </div>
          <div className={`col-lg-6 col-12`}>
            <SectionText title={t('AboutSection.title')}>
            <div className={styles.mainDiv__item}>
              <h4>
                {t('AboutSection.desc')}
              </h4>
              {/* <p>Founder - Zura Katsitadze</p> */}
            </div>
            </SectionText>
            {/* <Item /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;
