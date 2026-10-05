'use client'

import Item from "./Item.js";
import styles from "./CompensationInfo.module.scss";
import image from "../../../components/Images/EarthPic.png";
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
            <SectionCover image={image} />
          </div>
          <div className={`col-lg-6 col-12`}>
            <SectionText
              title={t('FlightCancellationCompensationInfo.title')}
            >
              <div className={styles.item}>
                <h4>
                  {t('FlightCancellationCompensationInfo.name1')}
                </h4>
                <br></br>
                <p>
                {t('FlightCancellationCompensationInfo.desc1')}
                </p>
                <br></br>
                <h4>{t('FlightCancellationCompensationInfo.name2')}</h4>
                <br></br>
                <p>
                {t('FlightCancellationCompensationInfo.desc2')}
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
