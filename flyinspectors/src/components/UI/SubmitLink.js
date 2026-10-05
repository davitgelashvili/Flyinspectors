'use client'

import Link from '@/components/UI/LocaleLink'
import styles from './SubmitLink.module.scss'
import { useTranslation } from 'react-i18next';

const SubmitLink = ({className}) => {
  const {t} = useTranslation()
  return (
    <Link href={"/submit-claim"} className={`${className && className} ${styles.link}`}>{t('SubmitLink.text')}</Link>
  );
};

export default SubmitLink;
