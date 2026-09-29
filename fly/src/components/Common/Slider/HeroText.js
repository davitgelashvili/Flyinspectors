import Link from 'next/link'
import translations from './Slider.module';
import submitTranslations from '../../UI/SubmitLink.module';
import styles from './Slider.module.scss';

// რედაქტორი ცარიელზეც აბრუნებს "<p></p>"-ს — ტეგების გარეშე ვამოწმებთ
const hasContent = (html) =>
    !!html && html.replace(/<[^>]*>|&nbsp;/g, '').trim().length > 0;

// სერვერ კომპონენტია (JavaScript ბრაუზერს არ გადაეცემა): ყველაფერი, მათ შორის
// ლინკები, მზა HTML-შია. hero — ადმინიდან შენახული ტექსტი ({ title, accent, text }
// თითო ენაზე). ცარიელ ველზე ვიყენებთ ნაგულისხმევ თარგმანს.
const HeroText = ({ hero, locale }) => {
    const defaults = translations[locale].SliderHero;

    const savedTitle = hero?.title?.[locale]?.trim();
    const title = savedTitle || defaults.title;
    // ადმინში სათაური თუ შეცვალეს, ძველი ნარინჯისფერი ფრაზა მას აღარ მივაბათ
    const accent = hero?.accent?.[locale]?.trim() || (savedTitle ? '' : defaults.accent);
    const text = hero?.text?.[locale];

    return (
        <div>
            <h1 id="hero-title" className={styles.title}>
                {title}
                {accent && <> <span className={styles.title__accent}>{accent}</span></>}
            </h1>
            {hasContent(text) ? (
                // ბექი HTML-ს შენახვისას ასუფთავებს და h1-ს h2-ად აქცევს (back/utils/sanitizeHtml.js)
                <div className={styles.richText} dangerouslySetInnerHTML={{ __html: text }} />
            ) : (
                <p className={styles.text}>{defaults.sub}</p>
            )}
            <div className={styles.actions}>
                <Link href={`/${locale}/submit-claim`} className={styles.actions__claim}>
                    {submitTranslations[locale].SubmitLink.text}
                </Link>
                <Link href={`/${locale}/check-status`} className={styles.actions__status}>
                    {defaults.statusLink}
                </Link>
            </div>
        </div>
    );
};

export default HeroText;
