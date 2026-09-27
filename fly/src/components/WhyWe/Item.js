'use client'

import { useTranslation } from "react-i18next";
import styles from "./WhyWe.module.scss";

const Item = ({ title, desc }) => {
  const {t} = useTranslation()
  return (
    <div className={styles.mainDiv}>
      <h3 className={styles.header}> {t('WHYFLYINSPECTORS.title')}</h3>
      <div className={styles.Item}>
        <p>
          {t('WHYFLYINSPECTORS.desc')}
        </p>
      </div>
    </div>
  );
};

export default Item;
