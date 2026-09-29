import { getHow, getServices } from "@/api/serverApi";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/locales";
import translations from "./ServicesOptions.module";
import styles from "./ServicesOptions.module.scss";
import Item from "./Item";

// ბაზის ჩანაწერიდან მიმდინარე ენის საფეხურები. საფეხური, რომელსაც ამ ენაზე
// სათაური არ აქვს, ამ ენის გვერდზე არ ჩანს.
const pick = (items, locale) =>
    (Array.isArray(items) ? items : [])
        .map((item) => ({
            key: item._id || item.id,
            title: item.title?.[locale]?.trim(),
            desc: (item.desc ?? item.description)?.[locale]?.trim(),
        }))
        .filter((item) => item.title);

// სერვერ კომპონენტია: ტექსტი ბაზიდან სერვერზე იკითხება და მზა HTML-ში ჩაისმება,
// ამიტომ Google-ი მას JavaScript-ის გარეშე ხედავს. შედეგი 60 წამით იკეშება.
//
// რიგი: 1) ადმინიდან შენახული "როგორ მუშაობს" (/how)
//       2) ძველი /services ჩანაწერები — რომ არსებული ტექსტი არ დაიკარგოს
//       3) დიზაინის ნაგულისხმევი ტექსტი
const ServicesOptions = async ({ lang }) => {
    const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
    const defaults = translations[locale];

    const how = await getHow();
    let steps = pick(how?.items, locale);

    if (!steps.length) steps = pick(await getServices(), locale);
    if (!steps.length) steps = defaults.steps.map((s, i) => ({ key: i, ...s }));

    const title = how?.sectionTitle?.[locale]?.trim() || defaults.title;

    // HowTo — schema.org-ის მარკირება. "<" ვაესკეიპებთ, რომ ტექსტმა <script> ვერ დახუროს.
    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: title,
        inLanguage: locale,
        step: steps.map((step, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: step.title,
            text: step.desc || step.title,
        })),
    }).replace(/</g, "\\u003c");

    return (
        <section className={styles.how} aria-labelledby="how-it-works-title">
            <div className={styles.how__inner}>
                <h2 id="how-it-works-title" className={styles.how__title}>{title}</h2>
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
