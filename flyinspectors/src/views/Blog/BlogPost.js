import Link from 'next/link'
import { richContent } from '@/utils/externalLinks'
import { cloudinaryImage } from '@/utils/cloudinary'
import {
    postText,
    postSummary,
    BLOG_PATH,
    withLocalePath,
    formatPostDate,
    postDateAttr,
} from '@/utils/post'
import content from './Blog.content'
import styles from './BlogPost.module.scss'

export default function BlogPost({ post, locale }) {
    const t = content[locale] || content.en
    const title = postText(post, 'title', locale)
    const body = postText(post, 'content', locale)
    const summary = postSummary(post, locale)
    const date = formatPostDate(post.publishedAt, locale)

    return (
        <main className={styles.post}>
            {post.cover && (
                <div className={styles.post__cover}>
                    <img
                        src={cloudinaryImage(post.cover)}
                        alt={postText(post, 'coverAlt', locale) || title}
                    />
                </div>
            )}

            <div className="container">
                <article className={styles.post__article}>
                    <Link href={withLocalePath(BLOG_PATH, locale)} className={styles.post__back}>
                        ← {t.backToBlog}
                    </Link>

                    {title && <h1 className={styles.post__title}>{title}</h1>}

                    {date && (
                        <time className={styles.post__date} dateTime={postDateAttr(post.publishedAt)}>
                            {date}
                        </time>
                    )}

                    {/* მოკლე აღწერა სტატიის შესავალია; სრული ტექსტი ქვემოთაა */}
                    {summary && <p className={styles.post__lead}>{summary}</p>}

                    {/* ტექსტი ადმინის რედაქტორიდან მოდის HTML-ად და ბექი მას შენახვისას
                        ასუფთავებს (server/utils/sanitizeHtml.js) */}
                    <div
                        className="rich-content article-content"
                        dangerouslySetInnerHTML={{ __html: richContent(body) }}
                    />
                </article>
            </div>
        </main>
    )
}
