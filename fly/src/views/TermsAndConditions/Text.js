import { getTerms } from "@/api/serverApi";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/locales";
import content from "./Terms.content";
import styles from "./Terms.module.scss";
import { externalLinks } from '@/utils/externalLinks'

// რედაქტორი ცარიელზეც აბრუნებს "<p></p>"-ს — ტეგების გარეშე ვამოწმებთ
const hasContent = (html) =>
    !!html && html.replace(/<[^>]*>|&nbsp;/g, "").trim().length > 0;

// სერვერ კომპონენტია: სათაური და ტექსტი ბაზიდან სერვერზე იკითხება და მზა HTML-ში ჩაისმება,
// ამიტომ Google-ი მას JavaScript-ის გარეშე ხედავს. შედეგი 60 წამით იკეშება, ადმინში
// შენახვისას კი მყისიერად ახლდება.
// სათაური — <h1> (გვერდზე სხვა h1 არ არის); ტექსტში რედაქტორის H1 ბექში H2-ად გარდაიქმნება.
async function Text({ lang }) {
    const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
    const labels = content[locale];
    const terms = await getTerms();

    const title = terms?.title?.[locale]?.trim();
    const text = terms?.text?.[locale];
    const showText = hasContent(text);

    if (!title && !showText) return null;

    const updatedAt = terms?.updatedAt ? new Date(terms.updatedAt) : null;
    const hasDate = updatedAt && !Number.isNaN(updatedAt.getTime());

    // "<" ვაესკეიპებთ, რომ ტექსტმა <script> ვერ დახუროს
    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        ...(title && { name: title }),
        inLanguage: locale,
        ...(hasDate && { dateModified: updatedAt.toISOString() }),
    }).replace(/</g, "\\u003c");

    return (
        <article className={styles.terms}>
            <div className={styles.terms__inner}>
                {title && <h1 className={styles.terms__title}>{title}</h1>}

                {hasDate && (
                    <p className={styles.terms__updated}>
                        {labels.updated}:{" "}
                        <time dateTime={updatedAt.toISOString()}>
                            {new Intl.DateTimeFormat(labels.dateLocale, { dateStyle: "long" }).format(updatedAt)}
                        </time>
                    </p>
                )}

                {showText && (
                    // ბექი HTML-ს შენახვისას ასუფთავებს (back/utils/sanitizeHtml.js)
                    <div className={`${styles.terms__text} rich-content`} dangerouslySetInnerHTML={{ __html: externalLinks(text) }} />
                )}
            </div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        </article>
    );
}

export default Text;
