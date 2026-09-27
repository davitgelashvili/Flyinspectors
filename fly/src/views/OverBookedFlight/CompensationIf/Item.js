'use client'

import { useTranslation } from "react-i18next";
import styles from "./CompensationIf.module.scss";

const Item = () => {
  const {t} = useTranslation()
  return (
    <div>
      <h3 className={styles.headerOfQuestion}>{t('OverBookedCompensationIf.title2')}</h3>
      <div className={styles.item}>
        <div className={styles.TextOfQuestion}>{t('OverBookedCompensationIf.text1')}</div>
        <div className={styles.TextOfQuestion}>{t('OverBookedCompensationIf.text2')}</div>
      </div>
    </div>
  );
};

export default Item;
