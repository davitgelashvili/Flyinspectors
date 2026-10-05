'use client'

import Link from '@/components/UI/LocaleLink'
import useLocale from '@/i18n/useLocale'
import content from './NotFound.content'
import styles from './NotFound.module.scss'

// გვერდი, რომელიც ვერ მოიძებნა. ღილაკები მთავარ განყოფილებებზე ატარებს,
// რომ მომხმარებელი ჩიხში არ დარჩეს. ენა მისამართიდან (/ka/..., /en/...) მოდის.
export default function NotFound() {
  const locale = useLocale()
  const t = content[locale] || content.en

  return (
    <main className={styles.notfound}>
      <div className={`container ${styles.notfound__inner}`}>
        <p className={styles.notfound__code}>404</p>
        <h1 className={styles.notfound__title}>{t.title}</h1>
        <p className={styles.notfound__text}>{t.text}</p>

        <nav className={styles.notfound__links} aria-label={t.nav}>
          {t.links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.notfound__button} ${index === 0 ? styles['notfound__button--primary'] : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  )
}
