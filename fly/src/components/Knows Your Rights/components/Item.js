'use client'

import { useTranslation } from "react-i18next";
import styles from "./BeAware.module.scss";

const Item = () => {
  const {t} = useTranslation()
  return (
    <div className={styles.mainDiv}>
      <h3 className={styles.header}>{t('KnowsYourRights.header')}</h3>
      <div className={styles.item}>
        <p>
        {t('KnowsYourRights.content')}
        </p>
        <br></br>
      </div>
    </div>
  );
};

export default Item;
