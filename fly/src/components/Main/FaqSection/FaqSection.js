'use client'

import Item from "./Item.js";
import styles from "./FaqSection.module.scss";
import { useTranslation } from "react-i18next";

const FaqSection = () => {
  const {t} = useTranslation()
  
  return (
    <div className={styles.Faq}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-12 d-flex justify-content-center">
            <div className={styles.faqHeader}>{t('faqsection.title')}</div>
          </div>
          <div className="col-lg-12 col-12">
            <Item />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
