'use client'

import styles from "./CompensationInfo.module.scss";
import image from "../../../components/Images/EarthPic.png"
import SectionCover from "../../../components/SectionTextAndCover/SectionCover.js";
import SectionText from "../../../components/SectionTextAndCover/SectionText.js";
import { useTranslation } from "react-i18next";


const CompensationInfo = () => {
  const {t} = useTranslation()

  const data = {
    title: t('CompensationInfo.title'),
    name1: t('CompensationInfo.name1'),
    desc1: t('CompensationInfo.desc1'),
    name2: t('CompensationInfo.name2'),
    desc2: t('CompensationInfo.desc2')
  }
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <div className="row">
          <div className="col-lg-6 col-12">
            <SectionCover image={image}/>
          {/* <img className={styles.image} src={image} alt="EarthPic" ></img> */}
          </div>
          <div className={`${styles.item} col-lg-6 col-12`}>
            <SectionText title={data.title}>
            <div className={styles.item}>
              <h4>{data.name1}</h4>
              <p>
                {data.desc1}
              </p>
              <br></br>
              <h4>{data.name2}</h4>
              <p>
                {data.desc2}
              </p>
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
