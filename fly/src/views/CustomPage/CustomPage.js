import styles from './CustomPage.module.scss'

export default function CustomPage({ page, locale }) {
    const title = page.title?.[locale] || page.title?.en || ''
    const content = page.content?.[locale] || page.content?.en || ''

    return (
        <main className={styles.page}>
            {page.cover && (
                <div className={styles.page__cover}>
                    <img src={page.cover} alt={title} />
                </div>
            )}

            <div className="container">
                <article className={styles.page__article}>
                    {title && <h1 className={styles.page__title}>{title}</h1>}

                    {/* კონტენტი ადმინის რედაქტორიდან მოდის HTML-ად.
                        გვერდის შექმნა მხოლოდ admin/editor როლებს შეუძლიათ. */}
                    <div
                        className={`${styles.page__content} rich-content`}
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </article>
            </div>
        </main>
    )
}
