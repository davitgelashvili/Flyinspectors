import styles from './CustomPage.module.scss'
import { richContent } from '@/utils/externalLinks'
import { cloudinaryImage } from '@/utils/cloudinary'

export default function CustomPage({ page, locale }) {
    const title = page.title?.[locale] || page.title?.en || ''
    const content = page.content?.[locale] || page.content?.en || ''
    // ადმინში შევსებული alt; არ არის → სათაური (ცარიელ alt-ს ჯობია)
    const coverAlt = page.coverAlt?.[locale] || page.coverAlt?.en || title

    return (
        <main className={styles.page}>
            {page.cover && (
                <div className={styles.page__cover}>
                    <img src={cloudinaryImage(page.cover)} alt={coverAlt} />
                </div>
            )}

            <div className="container">
                <article className={styles.page__article}>
                    {title && <h1 className={styles.page__title}>{title}</h1>}

                    {/* კონტენტი ადმინის რედაქტორიდან მოდის HTML-ად.
                        გვერდის შექმნა მხოლოდ admin/editor როლებს შეუძლიათ. */}
                    <div
                        className="rich-content article-content"
                        dangerouslySetInnerHTML={{ __html: richContent(content) }}
                    />
                </article>
            </div>
        </main>
    )
}
