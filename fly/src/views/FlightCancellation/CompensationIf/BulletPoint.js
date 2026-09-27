'use client'

import { useTranslation } from "react-i18next";
import styles from "./CompensationIf.module.scss";

const BulletPoint = () => {
  const {t} = useTranslation()
  return (
    <div>
      <div className={styles.headerOfBullet}>
        {t('FlightCancellationCompensationIf.title')}
      </div>
      <ul className={styles.bulletList}>
        <li>{t('FlightCancellationCompensationIf._1')}</li>
        <li>{t('FlightCancellationCompensationIf._2')}</li>
        <li>{t('FlightCancellationCompensationIf._3')}</li>
        <li>{t('FlightCancellationCompensationIf._4')}</li>
      </ul>
    </div>
  );
};

export default BulletPoint;
