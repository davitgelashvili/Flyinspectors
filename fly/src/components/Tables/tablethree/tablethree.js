'use client'

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from "./CompensationHowMuch.module.scss";

const TableThree = () => {
    const { t } = useTranslation();

    return (
        <div style={{width: '100%', overflow: 'auto'}}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.header}>{t('tableerthree.header1')}</th>
                        <th className={styles.headerLg}>{t('tableerthree.header2')}</th>
                        <th className={styles.header}>{t('tableerthree.header3')}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={styles.cell}>{t('tableerthree.cell1')}</td>
                        <td className={styles.cell}>{t('tableerthree.cell2')}</td>
                        <td className={styles.cell}>{t('tableerthree.cell3')}</td>
                    </tr>
                    <tr>
                        <td className={styles.cell}>{t('tableerthree.cell4')}</td>
                        <td className={styles.cell}>{t('tableerthree.cell5')}</td>
                        <td className={styles.cell}>{t('tableerthree.cell6')}</td>
                    </tr>
                    <tr>
                        <td className={styles.cell}>{t('tableerthree.cell7')}</td>
                        <td className={styles.cell}>{t('tableerthree.cell8')}</td>
                        <td className={styles.cell}>{t('tableerthree.cell9')}</td>
                    </tr>
                    <tr>
                        <td className={styles.cell}>{t('tableerthree.cell10')}</td>
                        <td className={styles.cell}>{t('tableerthree.cell11')}</td>
                        <td className={styles.cell}>{t('tableerthree.cell12')}</td>
                    </tr>
                    <tr>
                        <td className={styles.cell}>{t('tableerthree.cell13')}</td>
                        <td className={styles.cell}>{t('tableerthree.cell14')}</td>
                        <td className={styles.cell}>{t('tableerthree.cell15')}</td>
                    </tr>
                    <tr>
                        <td className={styles.cell}>{t('tableerthree.cell16')}</td>
                        <td className={styles.cell}>{t('tableerthree.cell17')}</td>
                        <td className={styles.cell}>{t('tableerthree.cell18')}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TableThree;