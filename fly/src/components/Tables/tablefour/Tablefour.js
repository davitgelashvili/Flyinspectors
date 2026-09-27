'use client'

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from "./CompensationIf.module.scss";

const Tablefour = () => {
  const { t } = useTranslation();

  return (
    <div style={{width: '100%', overflow: 'auto'}}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.header}>{t('tablefour.header1')}</th>
            <th className={styles.header}>{t('tablefour.header2')}</th>
            <th className={styles.header}>{t('tablefour.header3')}</th>
            <th className={styles.header}>{t('tablefour.header4')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.cell}>{t('tablefour.cell1')}</td>
            <td className={styles.cell}>{t('tablefour.cell2')}</td>
            <td className={styles.cell}>{t('tablefour.cell3')}</td>
            <td className={styles.cell}>{t('tablefour.cell4')}</td>
          </tr>
          <tr>
            <td className={styles.cell}>{t('tablefour.cell5')}</td>
            <td className={styles.cell}>{t('tablefour.cell6')}</td>
            <td className={styles.cell}>{t('tablefour.cell7')}</td>
            <td className={styles.cell}>{t('tablefour.cell8')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Tablefour;