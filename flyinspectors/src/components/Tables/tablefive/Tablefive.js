'use client'

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from "./CompensationIf.module.scss";

const Tablefive = () => {
  const { t } = useTranslation();

  return (
    <div style={{width: '100%', overflow: 'auto'}}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.header}>{t('tablefive.header1')}</th>
            <th className={styles.header}>{t('tablefive.header2')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.cell}>{t('tablefive.cell1')}</td>
            <td className={styles.cell}>{t('tablefive.cell2')}</td>
          </tr>
          <tr>
            <td className={styles.cell}>{t('tablefive.cell3')}</td>
            <td className={styles.cell}>{t('tablefive.cell4')}</td>
          </tr>
          <tr>
            <td className={styles.cell}>{t('tablefive.cell5')}</td>
            <td className={styles.cell}>{t('tablefive.cell6')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Tablefive;