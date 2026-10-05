'use client'

import { Children } from 'react'
import styles from './Content.module.scss'

const LANGUAGES = [
    { code: 'ka', label: 'ქარ' },
    { code: 'en', label: 'eng' },
]

/**
 * ორენოვანი კონტენტის გარსი. შვილებს `lang` პროპით ფილტრავს —
 * `lang`-ის გარეშე შვილი ყოველთვის ჩანს (საერთო ველები, მაგ. ფოტო ან id).
 */
export default function Content({ title, children, language, setLanguage, actions }) {
    const visible = Children.toArray(children).filter(
        (child) => child?.props?.lang === undefined || child.props.lang === language
    )

    return (
        <div className={`${styles['content']}`}>
            <div className={`${styles['content__head']}`}>
                <h1 className={`${styles['content__title']}`}>{title}</h1>
                {actions && <div className={`${styles['content__actions']}`}>{actions}</div>}
            </div>

            <div className={`${styles['content__langs']}`}>
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.code}
                        type="button"
                        onClick={() => setLanguage(lang.code)}
                        className={`${styles['content__lang']} ${language === lang.code ? styles['active'] : ''}`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>

            <div className={`${styles['content__body']}`}>{visible}</div>
        </div>
    )
}
