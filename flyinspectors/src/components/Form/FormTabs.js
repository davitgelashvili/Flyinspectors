'use client'

import Link from '@/components/UI/LocaleLink'
import { useTranslation } from 'react-i18next'
import styles from './form.module.scss'

const FormTabs = ({ active }) => {
    const { t } = useTranslation()

    return (
        <div className={`${styles['form__head']}`}>
            <Link
                href="/submit-claim"
                className={`${styles['form__head--btn']} ${active === 'form' ? styles['active'] : ''}`}
            >
                {t('submitForm.name1')}
            </Link>
            <Link
                href="/check-status"
                className={`${styles['form__head--btn']} ${active === 'status' ? styles['active'] : ''}`}
            >
                {t('submitForm.name2')}
            </Link>
        </div>
    )
}

export default FormTabs
