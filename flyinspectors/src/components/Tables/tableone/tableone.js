'use client'

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from "./CompensationIf.module.scss";

const TableOne = () => {
    const { t } = useTranslation();

    return (
        <div style={{width: '100%', overflow: 'auto'}}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.header}>{t('tableeone.header1')}</th>
                        <th className={styles.header}>{t('tableeone.header2')}</th>
                        <th className={styles.header}>{t('tableeone.header3')}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={styles.cell}>{t('tableeone.cell1')}</td>
                        <td className={styles.cell}>{t('tableeone.cell2')}</td>
                        <td className={styles.cell}>{t('tableeone.cell3')}</td>
                    </tr>
                    <tr>
                        <td className={styles.cell}>{t('tableeone.cell4')}</td>
                        <td className={styles.cell}>{t('tableeone.cell5')}</td>
                        <td className={styles.cell}>{t('tableeone.cell6')}</td>
                    </tr>
                    <tr>
                        <td className={styles.cell}>{t('tableeone.cell7')}</td>
                        <td className={styles.cell}>{t('tableeone.cell8')}</td>
                        <td className={styles.cell}>{t('tableeone.cell9')}</td>
                    </tr>
                    <tr>
                        <td className={styles.cell}>{t('tableeone.cell10')}</td>
                        <td className={styles.cell}>{t('tableeone.cell11')}</td>
                        <td className={styles.cell}>{t('tableeone.cell12')}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TableOne;