import content from './Faq.content'
import styles from './Faq.module.scss'
import { externalLinks } from '@/utils/externalLinks'

// რედაქტორი ცარიელზეც აბრუნებს "<p></p>"-ს — ტეგების გარეშე ვამოწმებთ
const hasContent = (html) =>
    !!html && html.replace(/<[^>]*>|&nbsp;/g, '').trim().length > 0

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' }

// პასუხის HTML → უბრალო ტექსტი (structured data-სთვის)
const toText = (html) =>
    html
        .replace(/<\/(p|li|h[1-6]|blockquote)>/g, ' ')
        .replace(/<[^>]*>/g, '')
        .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m])
        .replace(/\s+/g, ' ')
        .trim()

/**
 * ხშირად დასმული კითხვების სია (სერვერ კომპონენტი): მთავარზე (მონიშნულები) და FAQ გვერდზე (ყველა).
 *
 * SEO:
 *  - პასუხი <details>-ის შიგნით მზა HTML-შია და დახურულზეც იკითხება, ამიტომ Google-ი მას
 *    JavaScript-ის გარეშე ხედავს; გახსნა-დახურვას ბრაუზერი თვითონ აკეთებს (JS არ სჭირდება).
 *  - კითხვა <h3>-ია, სექციის სათაური კი `as` პროპით განისაზღვრება: მთავარზე h2,
 *    FAQ გვერდზე h1 (იქ სხვა h1 არ არის).
 *  - FAQPage JSON-LD.
 * ტექსტი მხოლოდ ბაზიდან მოდის; კითხვა, რომელსაც ამ ენაზე სათაური არ აქვს, არ ჩანს.
 */
export default function FaqList({ faqs, locale, as: Heading = 'h2' }) {
    const items = (Array.isArray(faqs) ? faqs : [])
        .map((faq) => ({
            key: faq._id,
            question: faq.title?.[locale]?.trim(),
            answer: faq.text?.[locale],
        }))
        .filter((item) => item.question)

    if (!items.length) return null

    // "<" ვაესკეიპებთ, რომ ტექსტმა <script> ვერ დახუროს
    const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: locale,
        mainEntity: items
            .filter((item) => hasContent(item.answer))
            .map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: toText(item.answer) },
            })),
    }).replace(/</g, '\\u003c')

    return (
        <section className={styles.faq} aria-labelledby="faq-title">
            <div className={styles.faq__inner}>
                <Heading id="faq-title" className={styles.faq__title}>{content[locale].title}</Heading>

                <div className={styles.faq__list}>
                    {items.map((item) => (
                        <details key={item.key} className={styles.item}>
                            <summary className={styles.item__question}>
                                <h3 className={styles.item__title}>{item.question}</h3>
                                <span className={styles.item__icon} aria-hidden="true" />
                            </summary>
                            {hasContent(item.answer) && (
                                // ბექი HTML-ს შენახვისას ასუფთავებს (back/utils/sanitizeHtml.js)
                                <div className={`${styles.item__answer} rich-content`} dangerouslySetInnerHTML={{ __html: externalLinks(item.answer) }} />
                            )}
                        </details>
                    ))}
                </div>
            </div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        </section>
    )
}
