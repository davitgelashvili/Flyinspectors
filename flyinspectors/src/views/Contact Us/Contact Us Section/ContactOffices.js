import { normalizeOffices, telHref } from "@/components/Offices/officeUtils";
import content from "./ContactOffices.content";
import styles from "./ContactOffices.module.scss";

// სერვერ კომპონენტია: ოფისები ბაზიდან სერვერზე იკითხება და მზა HTML-ში ჩაისმება, ამიტომ
// Google-ი ნომრებს, ელფოსტას და მისამართს JavaScript-ის გარეშე ხედავს.
//  - <h1> — გვერდის სათაური, <h2> — თითო ქვეყანა, <address> + tel:/mailto: ბმულები
//  - schema.org (ContactPage + Organization) layout-სა და route-შია: src/seo/jsonLd.js
// ოფისების რიგი ადმინში განისაზღვრება. ოფისი, რომელსაც არაფერი აქვს შევსებული, არ ჩანს.
const ContactOffices = ({ offices, locale }) => {
    const labels = content[locale];

    const items = normalizeOffices(offices, locale);

    return (
        <section className={styles.contact} aria-labelledby="contact-title">
            <div className={`container ${styles.contact__inner}`}>
                <h1 id="contact-title" className={styles.contact__title}>{labels.title}</h1>

                <div className={styles.contact__grid}>
                    {items.map((office) => (
                        <article className={styles.office} key={office.key}>
                            <div className={styles.office__bar} />
                            {office.country && <h2 className={styles.office__country}>{office.country}</h2>}

                            <address className={styles.office__details}>
                                <dl className={styles.office__list}>
                                    {office.phone && (
                                        <div>
                                            <dt className={styles.office__label}>{labels.phone}</dt>
                                            <dd className={styles.office__value}>
                                                <a className={styles.office__link} href={telHref(office.phone)}>{office.phone}</a>
                                            </dd>
                                        </div>
                                    )}
                                    {office.email && (
                                        <div>
                                            <dt className={styles.office__label}>{labels.email}</dt>
                                            <dd className={styles.office__value}>
                                                <a className={styles.office__link} href={`mailto:${office.email}`}>{office.email}</a>
                                            </dd>
                                        </div>
                                    )}
                                    {office.address && (
                                        <div>
                                            <dt className={styles.office__label}>{labels.address}</dt>
                                            <dd className={styles.office__value}>{office.address}</dd>
                                        </div>
                                    )}
                                </dl>
                            </address>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContactOffices;
