'use client'

import { useTranslation } from "react-i18next";
import styles from "./CompensationIf.module.scss";

const BulletPoint = () => {
  const {t} = useTranslation()
  const data = {
    title: t('CompensationIf.title'),
    _1: t('CompensationIf._1'),
    _2: t('CompensationIf._2'),
    _3: t('CompensationIf._3'),
    _4: t('CompensationIf._4'),
    _5: t('CompensationIf._5'),
    _6: t('CompensationIf._6')
  }

  return (
    <div>
      <div className={styles.headerOfBullet}>
        {data.title}
      </div>
      <ul className={styles.bulletList}>
        <li>{data._1}</li>
        <li>{data._2}</li>
        <li>{data._3}</li>
        <li>{data._4}</li>
        <li>{data._5}</li>
        <li>{data._6}</li>
      </ul>
    </div>
  );
};

export default BulletPoint;
