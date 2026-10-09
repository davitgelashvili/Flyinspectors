import Link from 'next/link'
import { cloudinaryImage } from '@/utils/cloudinary'
import {
    postText,
    postSummary,
    postPath,
    withLocalePath,
    formatPostDate,
    postDateAttr,
} from '@/utils/post'
import content from './Blog.content'
import Pagination from './Pagination'
import styles from './BlogList.module.scss'

function PostCard({ post, locale, t }) {
    const title = postText(post, 'title', locale)
    const summary = postSummary(post, locale)
    const href = withLocalePath(postPath(post.slug), locale)
    const date = formatPostDate(post.publishedAt, locale)

    return (
        <article className={styles.card}>
            {/* მთელი ბარათი ერთი ბმულია; "ვრცლად" ვიზუალური მინიშნებაა და ცალკე ბმული არ არის,
                რომ screen reader-ს ერთსა და იმავე სტატიაზე ორი ბმული არ წაუკითხოს */}
            <Link href={href} className={styles.card__link}>
                <div className={styles.card__cover}>
                    {post.cover
                        ? <img
                            src={cloudinaryImage(post.cover)}
                            alt={postText(post, 'coverAlt', locale) || title}
                            loading="lazy"
                          />
                        : <span className={styles.card__nocover} aria-hidden="true" />}
                </div>

                <div className={styles.card__body}>
                    {date && (
                        <time className={styles.card__date} dateTime={postDateAttr(post.publishedAt)}>
                            {date}
                        </time>
                    )}
                    <h2 className={styles.card__title}>{title}</h2>
                    {summary && <p className={styles.card__text}>{summary}</p>}
                    <span className={styles.card__more}>{t.readMore} →</span>
                </div>
            </Link>
        </article>
    )
}

export default function BlogList({ posts, page, pages, locale }) {
    const t = content[locale] || content.en

    return (
        <main className={styles.blog}>
            <div className="container">
                <div className={styles.blog__head}>
                    <h1 className={styles.blog__title}>{t.title}</h1>
                    <p className={styles.blog__subtitle}>{t.subtitle}</p>
                </div>

                {posts.length === 0
                    ? <p className={styles.blog__empty}>{t.empty}</p>
                    : (
                        <div className={styles.blog__grid}>
                            {posts.map((post) => (
                                <PostCard key={post._id || post.slug} post={post} locale={locale} t={t} />
                            ))}
                        </div>
                    )}

                <Pagination page={page} pages={pages} locale={locale} />
            </div>
        </main>
    )
}
