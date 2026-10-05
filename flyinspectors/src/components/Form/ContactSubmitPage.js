import { normalizeOffices, telHref } from "../Offices/officeUtils";
import translations from "./Form.module";
import styles from "./ContactSubmitPage.module.scss";

// განაცხადის გვერდის კონტაქტის ბლოკი. სერვერ კომპონენტია: ოფისები ბაზიდან მოდის
// (ადმინი → საკონტაქტო), ტელეფონი და ელფოსტა კი მზა ბმულებია (tel:, mailto:).
const ContactSubmitPage = ({ offices, locale }) => {
  const items = normalizeOffices(offices, locale);

  return (
    <div className={styles.mainDiv}>
      <h3 className={styles.header}>
          {translations[locale].submitForm.contacttitle}
      </h3>
      <div className={styles.item}>
        {items.map((office) => (
          <address className={styles.office} key={office.key}>
            {office.country && <h4>{office.country}</h4>}
            {office.phone && (
              <p><a href={telHref(office.phone)}>{office.phone}</a></p>
            )}
            {office.email && (
              <p><a href={`mailto:${office.email}`}>{office.email}</a></p>
            )}
            {office.address && <p>{office.address}</p>}
          </address>
        ))}
      </div>
    </div>
  );
};

export default ContactSubmitPage;
