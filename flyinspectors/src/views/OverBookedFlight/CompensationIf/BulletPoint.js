'use client'

import { useTranslation } from "react-i18next";
import styles from "./CompensationIf.module.scss";

const BulletPoint = () => {
  const {t} = useTranslation()
  return (
    <div>
      <div className={styles.headerOfBullet}>
        {t('OverBookedCompensationIf.title')}
      </div>
      <ul className={styles.bulletList}>
        <li>{t('OverBookedCompensationIf._1')}</li>
        <li>{t('OverBookedCompensationIf._2')}</li>
        <li>{t('OverBookedCompensationIf._3')}</li>
        <li>{t('OverBookedCompensationIf._4')}</li>
      </ul>
    </div>
  );
};

export default BulletPoint;
