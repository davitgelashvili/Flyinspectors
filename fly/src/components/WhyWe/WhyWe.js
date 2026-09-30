import { getWhy } from "@/api/serverApi";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/locales";
import content from "./WhyWe.content";
import styles from "./WhyWe.module.scss";

// რედაქტორი ცარიელზეც აბრუნებს "<p></p>"-ს — ტეგების გარეშე ვამოწმებთ
const hasContent = (html) =>
  !!html && html.replace(/<[^>]*>|&nbsp;/g, "").trim().length > 0;

// სერვერ კომპონენტია: სათაური და ტექსტი ბაზიდან სერვერზე იკითხება და მზა HTML-ში
// ჩაისმება, ამიტომ Google-ი მათ JavaScript-ის გარეშე ხედავს. შედეგი 60 წამით იკეშება.
// მარცხენა ნაწილი მხოლოდ ბაზიდან მოდის (ფრონტში ნაგულისხმევი აღარ არის), ცარიელს
// არ ვხატავთ. მარჯვენა ბარათი სტატიკურია (WhyWe.content.js) და ადმინიდან არ იცვლება.
const WhyWe = async ({ lang }) => {
  const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
  const card = content[locale];
  const why = await getWhy();

  const title = why?.title?.[locale]?.trim();
  const text = why?.text?.[locale];
  // ბექი HTML-ს შენახვისას ასუფთავებს და h1-ს h2-ად აქცევს (back/utils/sanitizeHtml.js)
  const showText = hasContent(text);

  return (
    <section className={styles.why} aria-labelledby={title ? "why-title" : undefined}>
      <div className={`container ${styles.why__inner}`}>
        {(title || showText) && (
          <div>
            {title && <h2 id="why-title" className={styles.why__title}>{title}</h2>}
            {showText && <div className={`${styles.richText} rich-content`} dangerouslySetInnerHTML={{ __html: text }} />}
          </div>
        )}

        <aside className={styles.stat}>
          <p className={styles.stat__number}>{card.stat}</p>
          <p className={styles.stat__text}>{card.statText}</p>
          <hr className={styles.stat__divider} />
          <p className={styles.stat__closing}>{card.closing}</p>
        </aside>
      </div>
    </section>
  );
};

export default WhyWe;
