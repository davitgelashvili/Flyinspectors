'use client'

import { useTranslation } from "react-i18next";
import styles from "./BeAware.module.scss";

const Item = () => {
  const {t} = useTranslation()
  return (
    <div>
      <div className={styles.headerOfBullet}>
      {t('LostLuggageBeAware.title')}
      </div>
      <ul className={styles.bulletList}>
        <li>{t('LostLuggageBeAware._1')}</li>
        <li>{t('LostLuggageBeAware._2')}</li>
        <li>{t('LostLuggageBeAware._3')}</li>
        <li>{t('LostLuggageBeAware._4')}</li>
        <li>{t('LostLuggageBeAware._5')}</li>
      </ul>
    </div>
  );
};

export default Item;
