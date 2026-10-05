'use client'

import styles from "./CompensationInfo.module.scss";
import Image from "../../../components/Images/LostLuggage.png";
import SectionCover from "../../../components/SectionTextAndCover/SectionCover.js";
import SectionText from "../../../components/SectionTextAndCover/SectionText.js";
import { useTranslation } from "react-i18next";


const CompensationInfo = () => {
  const {t} = useTranslation()
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <div className="row">
          <div className="col-lg-6 col-12">
            {/* <img className={styles.image} src={Image} alt="Lost Luggage"></img> */}
            <SectionCover image={Image} />
          </div>
          <div className={`${styles.item} col-lg-6 col-12`}>
            <SectionText title={t('LostLuggageCompensationInfo.title')}>
            <div className={styles.item}>
              <h4>
                {t('LostLuggageCompensationInfo.desc')}
              </h4>
            </div>
            </SectionText>
            {/* <Item /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompensationInfo;
