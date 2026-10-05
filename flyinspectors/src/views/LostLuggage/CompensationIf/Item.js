'use client'

import { useTranslation } from "react-i18next";
import styles from "./CompensationIf.module.scss";

const Item = () => {
  const {t} = useTranslation()
  return (
    <div>
      <h3 className={styles.headerOfQuestion}>
        {t('LostLuggageCompensationIf.name')}
      </h3>
      <ul className={styles.bulletList}>
        <li>{t('LostLuggageCompensationIf.desc1')}</li>
        <li>{t('LostLuggageCompensationIf.desc2')}</li>
        <li>{t('LostLuggageCompensationIf.desc3')}</li>
        <li>{t('LostLuggageCompensationIf.desc4')}</li>
      </ul>
    </div>
  );
};

export default Item;
