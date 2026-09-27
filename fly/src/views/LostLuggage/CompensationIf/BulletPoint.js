'use client'

import { useTranslation } from "react-i18next";
import styles from "./CompensationIf.module.scss";

const BulletPoint = () => {
  const {t} = useTranslation()
  return (
    <div>
      <div className={styles.headerOfBullet}>
      {t('LostLuggageCompensationIf.title')}
      </div>
      <ul className={styles.bulletList}>
        <li>{t('LostLuggageCompensationIf._1')}</li>
        <li>
        {t('LostLuggageCompensationIf._2')}
        </li>
        <li>
        {t('LostLuggageCompensationIf._3')}
        </li>
        <li>{t('LostLuggageCompensationIf._4')}</li>
      </ul>
    </div>
  );
};

export default BulletPoint;
