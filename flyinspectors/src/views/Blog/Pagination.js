import Link from 'next/link'
import { blogPath, withLocalePath } from '@/utils/post'
import content from './Blog.content'
import styles from './Pagination.module.scss'

// ნომრების სია: ყოველთვის პირველი და ბოლო, მიმდინარის გარშემო ორი, დანარჩენის ადგილას "…".
// ასე 20 გვერდზეც მოკლე რიგი რჩება და ბოტსაც ყველა გვერდამდე მისასვლელი ბმული აქვს.
function pageItems(page, pages) {
    const around = new Set([1, pages, page - 1, page, page + 1])
    const list = [...around].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b)

    return list.flatMap((n, i) => (i > 0 && n - list[i - 1] > 1 ? ['gap', n] : [n]))
}

export default function Pagination({ page, pages, locale }) {
    if (pages <= 1) return null

    const t = content[locale] || content.en
    const href = (n) => withLocalePath(blogPath(n), locale)

    return (
        <nav className={styles.pagination} aria-label={t.pageLabel}>
            {/* rel=prev/next — Google-ს უკვე არ სჭირდება, ბრაუზერსა და screen reader-ს კი კი */}
            {page > 1 && (
                <Link href={href(page - 1)} rel="prev" className={styles.pagination__arrow}>
                    ← {t.prev}
                </Link>
            )}

            <ul className={styles.pagination__list}>
                {pageItems(page, pages).map((item, index) =>
                    item === 'gap' ? (
                        <li key={`gap-${index}`} className={styles.pagination__gap} aria-hidden="true">…</li>
                    ) : item === page ? (
                        <li key={item}>
                            <span className={`${styles.pagination__item} ${styles.pagination__current}`} aria-current="page">
                                {item}
                            </span>
                        </li>
                    ) : (
                        <li key={item}>
                            <Link href={href(item)} className={styles.pagination__item}>{item}</Link>
                        </li>
                    )
                )}
            </ul>

            {page < pages && (
                <Link href={href(page + 1)} rel="next" className={styles.pagination__arrow}>
                    {t.next} →
                </Link>
            )}
        </nav>
    )
}
