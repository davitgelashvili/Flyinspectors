'use client'

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from "./CompensationHowMuch.module.scss";

const TableTwo = () => {
    const { t } = useTranslation();

    return (
        <div style={{width: '100%', overflow: 'auto'}}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.header}>{t('tableetwo.header1')}</th>
                        <th className={styles.headerLg}>{t('tableetwo.header2')}</th>
                        <th className={styles.header}>{t('tableetwo.header3')}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={styles.cell}>{t('tableetwo.cell1')}</td>
                        <td className={styles.cell}>{t('tableetwo.cell2')}</td>
                        <td className={styles.cell}>{t('tableetwo.cell3')}</td>
                    </tr>
                    <tr>
                        <td className={styles.cell}>{t('tableetwo.cell4')}</td>
                        <td className={styles.cell}>{t('tableetwo.cell5')}</td>
                        <td className={styles.cell}>{t('tableetwo.cell6')}</td>
                    </tr>
                    <tr>
                        <td className={styles.cell}>{t('tableetwo.cell7')}</td>
                        <td className={styles.cell}>{t('tableetwo.cell8')}</td>
                        <td className={styles.cell}>{t('tableetwo.cell9')}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TableTwo;