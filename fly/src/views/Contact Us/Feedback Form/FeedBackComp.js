'use client'

import { useTranslation } from "react-i18next";
import FeedBack from "./FeedBack";
import styles from "./FeedBack.module.scss";
function FeedBackComp() {
  const {t} = useTranslation()
  return (
  <div className={styles.mainDiv}>
    <div className="container">
      <h3 className="mt-5">{t('FeedBackComp.sectionTitle')}</h3>
      <FeedBack />
    </div>
  </div>
  );
}

export default FeedBackComp;
