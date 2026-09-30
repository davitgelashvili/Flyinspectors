import { normalizeOffices, telHref } from "@/components/Offices/officeUtils";
import { baseMetadata } from "../../../../app/baseMetadata";
import content from "./ContactOffices.content";
import styles from "./ContactOffices.module.scss";

const SITE_URL = baseMetadata.metadataBase.origin;

// სერვერ კომპონენტია: ოფისები ბაზიდან სერვერზე იკითხება და მზა HTML-ში ჩაისმება, ამიტომ
// Google-ი ნომრებს, ელფოსტას და მისამართს JavaScript-ის გარეშე ხედავს.
//  - <h1> — გვერდის სათაური, <h2> — თითო ქვეყანა, <address> + tel:/mailto: ბმულები
//  - ContactPage + Organization JSON-LD (contactPoint თითო ოფისზე)
// ოფისების რიგი ადმინში განისაზღვრება. ოფისი, რომელსაც არაფერი აქვს შევსებული, არ ჩანს.
const ContactOffices = ({ offices, locale }) => {
    const labels = content[locale];

    const items = normalizeOffices(offices, locale);

    // "<" ვაესკეიპებთ, რომ ტექსტმა <script> ვერ დახუროს
    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: labels.title,
        inLanguage: locale,
        mainEntity: {
            "@type": "Organization",
            name: "Flyinspectors",
            url: SITE_URL,
            contactPoint: items
                .filter((o) => o.phone || o.email)
                .map((o) => ({
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    ...(o.country && { areaServed: o.country }),
                    ...(o.phone && { telephone: o.phone }),
                    ...(o.email && { email: o.email }),
                    availableLanguage: ["ka", "en"],
                })),
            location: items
                .filter((o) => o.address)
                .map((o) => ({
                    "@type": "Place",
                    ...(o.country && { name: o.country }),
                    address: o.address,
                    ...(o.phone && { telephone: o.phone }),
                })),
        },
    }).replace(/</g, "\\u003c");

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
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        </section>
    );
};

export default ContactOffices;
