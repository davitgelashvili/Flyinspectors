import Link from 'next/link'
import translations from './Slider.module';
import submitTranslations from '../../UI/SubmitLink.module';
import styles from './Slider.module.scss';

// რედაქტორი ცარიელზეც აბრუნებს "<p></p>"-ს — ტეგების გარეშე ვამოწმებთ
const hasContent = (html) =>
    !!html && html.replace(/<[^>]*>|&nbsp;/g, '').trim().length > 0;

// სერვერ კომპონენტია (JavaScript ბრაუზერს არ გადაეცემა): ყველაფერი, მათ შორის
// ლინკები, მზა HTML-შია. სათაური, ნარინჯისფერი ფრაზა და ტექსტი მხოლოდ ბაზიდან
// მოდის (ადმინი → "მთავარი ტექსტი"): ფრონტში ნაგულისხმევი აღარ არის.
// ცარიელ ველს საერთოდ არ ვხატავთ, რომ ცარიელი <h1> არ გამოვიდეს.
const HeroText = ({ hero, locale }) => {
    const t = translations[locale].SliderHero;

    const title = hero?.title?.[locale]?.trim();
    const accent = hero?.accent?.[locale]?.trim();
    const text = hero?.text?.[locale];

    return (
        <div>
            {title && (
                <h1 id="hero-title" className={styles.title}>
                    {title}
                    {accent && <> <span className={styles.title__accent}>{accent}</span></>}
                </h1>
            )}
            {hasContent(text) && (
                // ბექი HTML-ს შენახვისას ასუფთავებს და h1-ს h2-ად აქცევს (back/utils/sanitizeHtml.js)
                <div className={`${styles.richText} rich-content`} dangerouslySetInnerHTML={{ __html: text }} />
            )}
            <div className={styles.actions}>
                <Link href={`/${locale}/submit-claim`} className={styles.actions__claim}>
                    {submitTranslations[locale].SubmitLink.text}
                </Link>
                <Link href={`/${locale}/check-status`} className={styles.actions__status}>
                    {t.statusLink}
                </Link>
            </div>
        </div>
    );
};

export default HeroText;
