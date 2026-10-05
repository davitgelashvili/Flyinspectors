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
            {/* <img className={styles.image} src={Image} alt="Pic Of canceled FLight"></img> */}
            <SectionCover image={Image} />
          </div>
          <div className={`col-lg-6 col-12`}>
            <SectionText title={t('MissedConnectionCompensationInfo.title')}>
            <div className={styles.item}>
          <h4>
          {t('MissedConnectionCompensationInfo.name')}
          </h4>
          <br></br>
          <p>
          {t('MissedConnectionCompensationInfo.desc')}
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
