import { getWhy } from "@/api/serverApi";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/locales";
import content from "./WhyWe.content";
import styles from "./WhyWe.module.scss";

// რედაქტორი ცარიელზეც აბრუნებს "<p></p>"-ს — ტეგების გარეშე ვამოწმებთ
const hasContent = (html) =>
  !!html && html.replace(/<[^>]*>|&nbsp;/g, "").trim().length > 0;

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ნაგულისხმევი აბზაცები HTML-ად; ბოლო გამუქებულია (როგორც დიზაინშია)
const defaultHtml = (paragraphs) =>
  paragraphs
    .map((p, i) => i === paragraphs.length - 1
      ? `<p><strong>${escapeHtml(p)}</strong></p>`
      : `<p>${escapeHtml(p)}</p>`)
    .join("");

// სერვერ კომპონენტია: სათაური და ტექსტი ბაზიდან სერვერზე იკითხება და მზა HTML-ში
// ჩაისმება, ამიტომ Google-ი მათ JavaScript-ის გარეშე ხედავს. შედეგი 60 წამით იკეშება.
// მარჯვენა ბარათი სტატიკურია (WhyWe.content.js) და ადმინიდან არ იცვლება.
const WhyWe = async ({ lang }) => {
  const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
  const defaults = content[locale];
  const why = await getWhy();

  const title = why?.title?.[locale]?.trim() || defaults.title;
  const saved = why?.text?.[locale];
  // ბექი HTML-ს შენახვისას ასუფთავებს და h1-ს h2-ად აქცევს (back/utils/sanitizeHtml.js)
  const html = hasContent(saved) ? saved : defaultHtml(defaults.paragraphs);

  return (
    <section className={styles.why} aria-labelledby="why-title">
      <div className={styles.why__inner}>
        <div>
          <h2 id="why-title" className={styles.why__title}>{title}</h2>
          <div className={styles.richText} dangerouslySetInnerHTML={{ __html: html }} />
        </div>

        <aside className={styles.stat}>
          <p className={styles.stat__number}>{defaults.stat}</p>
          <p className={styles.stat__text}>{defaults.statText}</p>
          <hr className={styles.stat__divider} />
          <p className={styles.stat__closing}>{defaults.closing}</p>
        </aside>
      </div>
    </section>
  );
};

export default WhyWe;
