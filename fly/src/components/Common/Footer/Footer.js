import React from "react";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import PageLinks from "./PageLinks";
import styles from "./Footer.module.scss";

// სერვერ კომპონენტია (layout-იდან იღებს ენას): მარცხნივ ლოგო და მის ქვეშ სოც. ქსელები,
// მარჯვნივ ნავიგაციის სვეტები (იხ. PageLinks.js).
const Footer = ({ lang }) => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footer__inner}`}>
        <div className={styles.footer__brand}>
          <Logo />
          <SocialMedia locale={lang} />
        </div>
        <PageLinks locale={lang} />
      </div>
      <div className={`container ${styles.footer__bottom}`}>© {new Date().getFullYear()} FlyInspectors</div>
    </footer>
  );
};

export default Footer;
