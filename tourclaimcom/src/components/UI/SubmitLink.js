import { Link } from 'react-router-dom';
import styles from './SubmitLink.module.scss'
import { useTranslation } from 'react-i18next';

const SubmitLink = ({className}) => {
  const {t} = useTranslation()
  return (
    <Link to={"/submit-claim"} className={`${className && className} ${styles.link}`}>{t('SubmitLink.text')}</Link>
  );
};

export default SubmitLink;
