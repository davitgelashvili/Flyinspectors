'use client'

import styles from "./BeAware.module.scss";
import image from "../../../components/Images/MonitorImage.png"
import SectionCover from "../../../components/SectionTextAndCover/SectionCover.js";
import SectionText from "../../../components/SectionTextAndCover/SectionText.js";
import { useTranslation } from "react-i18next";

const BeAware = () => {
  const {t} = useTranslation()
  
  return (
    <div>
      <div className={`${styles.services} container`}>
        <div className="row">
          <div className="col-lg-6 col-12">
            <SectionCover image={image} />
          </div>
          <div className={`col-lg-6 col-12`}>
            <SectionText title={t('Be Aware')}>
              <ul className={styles.bulletList}>
                <li>{t('OverBookedBeAware._1')}</li>
                <li>{t('OverBookedBeAware._2')}</li>
                <li>{t('OverBookedBeAware._3')}</li>
                <li>{t('OverBookedBeAware._4')}</li>
                <li>{t('OverBookedBeAware._5')}</li>
                <li>{t('OverBookedBeAware._6')}</li>
              </ul>
            </SectionText>
            {/* <Item /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeAware;
