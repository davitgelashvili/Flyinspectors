'use client'

import styles from "./BeAware.module.scss";
import image from "../../../components/Images/MonitorImage.png"
import SectionCover from "../../../components/SectionTextAndCover/SectionCover.js";
import SectionText from "../../../components/SectionTextAndCover/SectionText.js";
import { useTranslation } from "react-i18next";

const BeAware = () => {
  const {t} = useTranslation()
  const data = [
    {
      title: t('FlightDelayBeaware.item1.title'),
      desc: t('FlightDelayBeaware.item1.desc'),
    },
    {
      title: t('FlightDelayBeaware.item2.title'),
      desc: t('FlightDelayBeaware.item2.desc'),
    },
    {
      title: t('FlightDelayBeaware.item3.title'),
      desc: t('FlightDelayBeaware.item3.desc'),
    },
    {
      title: t('FlightDelayBeaware.item4.title'),
      desc: t('FlightDelayBeaware.item4.desc'),
    },
  ]
  return (
    <div className={styles.services}>
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <SectionCover image={image} />
          </div>
          <div className={`col-lg-7 col-12`}>
            <SectionText title={t('FlightDelayBeaware.title')}>
              <div className={styles.item}>
                {data?.map((item)=>{
                  return (
                    <div key={item.title}>
                      <h4>{item.title}</h4>
                      <p>
                        {item.desc}
                      </p>
                      <br />
                    </div>
                  )
                })}
              </div>
            </SectionText>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeAware;
