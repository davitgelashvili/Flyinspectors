'use client'

import styles from "./CompensationInfo.module.scss";
import Image from "../../../components/Images/FirstImage.png"
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
            <SectionCover image={Image} />
          </div>
          <div className={`col-lg-6 col-12`}>
            <SectionText title={t('OverBookedCompensationInfo.sectionTitle')}>
            <div className={styles.item}>
          <h4>
          {t('OverBookedCompensationInfo.title')}
          </h4>
          <br></br>
          <p>
          {t('OverBookedCompensationInfo.desc')}
          </p>
        </div>
            </SectionText>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompensationInfo;
