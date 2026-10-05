import { getHow } from "@/api/serverApi";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/locales";
import styles from "./ServicesOptions.module.scss";
import Item from "./Item";

// სერვერ კომპონენტია: ტექსტი ბაზიდან სერვერზე იკითხება და მზა HTML-ში ჩაისმება,
// ამიტომ Google-ი მას JavaScript-ის გარეშე ხედავს. შედეგი 60 წამით იკეშება.
// ტექსტი მხოლოდ ბაზიდან მოდის (ადმინი → "როგორ მუშაობს"): ფრონტში ნაგულისხმევი
// აღარ არის. საფეხურის გარეშე სექცია საერთოდ არ ჩანს.
const ServicesOptions = async ({ lang }) => {
    const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
    const how = await getHow();

    // საფეხური, რომელსაც ამ ენაზე სათაური არ აქვს, ამ ენის გვერდზე არ ჩანს
    const steps = (Array.isArray(how?.items) ? how.items : [])
        .map((item) => ({
            key: item._id,
            title: item.title?.[locale]?.trim(),
            desc: item.desc?.[locale]?.trim(),
        }))
        .filter((step) => step.title);

    if (!steps.length) return null;

    const title = how?.sectionTitle?.[locale]?.trim();

    // HowTo — schema.org-ის მარკირება. "<" ვაესკეიპებთ, რომ ტექსტმა <script> ვერ დახუროს.
    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        ...(title && { name: title }),
        inLanguage: locale,
        step: steps.map((step, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: step.title,
            text: step.desc || step.title,
        })),
    }).replace(/</g, "\\u003c");

    return (
        <section className={styles.how} aria-labelledby={title ? "how-it-works-title" : undefined}>
            <div className={`container ${styles.how__inner}`}>
                {title && <h2 id="how-it-works-title" className={styles.how__title}>{title}</h2>}
                <ol className={styles.how__steps}>
                    {steps.map((step, i) => (
                        <Item key={step.key} number={i + 1} title={step.title} desc={step.desc} />
                    ))}
                </ol>
            </div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        </section>
    );
};

export default ServicesOptions;
