import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.scss";

const PageLinks = () => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.MainDiv}`}>
      <div className="row">
        {/* Column 1 */}
        <div className="col-lg-3 col-6">
          <ul className={`nav flex-column ${styles.List}`}>
            <li className={`nav-item mb-2 ${styles.List__item}`}>
              <Link to="/" className={`nav-link ${styles.List__link}`}>
                {t('footer.home')}
              </Link>
            </li>
            <li className={`nav-item mb-2 ${styles.List__item}`}>
              <Link
                to="/submit-claim"
                className={`nav-link ${styles.List__link}`}
              >
                {t('footer.submitclaim')}
              </Link>
            </li>
            <li className={`nav-item mb-2 ${styles.List__item}`}>
              <Link
                to="/contact-us"
                className={`nav-link ${styles.List__link}`}
              >
                {t('footer.contactus')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="col-lg-3 col-6">
          <ul className={`nav flex-column ${styles.List}`}>
            <li className={`nav-item mb-2 ${styles.List__item}`}>
              <Link
                to="/about-us"
                className={`nav-link ${styles.List__link}`}
              >
                {t('footer.aboutus')}
              </Link>
            </li>
            <li className={`nav-item mb-2 ${styles.List__item}`}>
              <Link
                to="/your-rights/flight-delay"
                className={`nav-link ${styles.List__link}`}
              >
                {t('footer.flightdelay')}
              </Link>
            </li>
            <li className={`nav-item mb-2 ${styles.List__item}`}>
              <Link
                to="/your-rights/flight-cancellation"
                className={`nav-link ${styles.List__link}`}
              >
                {t('footer.flightcancellation')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="col-lg-3 col-6">
          <ul className={`nav flex-column ${styles.List}`}>
            <li className={`nav-item mb-2 ${styles.List__item}`}>
              <Link
                to="/your-rights/overbooked-flight"
                className={`nav-link ${styles.List__link}`}
              >
                {t('footer.overBookedflight')}
              </Link>
            </li>
            <li className={`nav-item mb-2 ${styles.List__item}`}>
              <Link
                to="/your-rights/missed-connection"
                className={`nav-link ${styles.List__link}`}
              >
                {t('footer.missedconnection')}
              </Link>
            </li>
            <li className={`nav-item mb-2 ${styles.List__item}`}>
              <Link
                to="/your-rights/lost-luggage"
                className={`nav-link ${styles.List__link}`}
              >
                {t('footer.lostluggage')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="col-lg-3 col-6">
          <ul className={`nav flex-column ${styles.List}`}>
            <li className={`nav-item mb-2 ${styles.List__item}`}>
              <Link
                to="/about-us/blog"
                className={`nav-link ${styles.List__link}`}
              >
                {t('footer.blog')}
              </Link>
            </li>
            <li className={`nav-item mb-2 ${styles.List__item}`}>
              <Link
                to="/terms-and-conditions"
                className={`nav-link ${styles.List__link}`}
              >
                {t('footer.termsandconditions')}
              </Link>
            </li>
            <li className={`nav-item mb-2 ${styles.List__item}`}>
              <Link
                to="/about-us/faq"
                className={`nav-link ${styles.List__link}`}
              >
                {t('footer.faq')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PageLinks;