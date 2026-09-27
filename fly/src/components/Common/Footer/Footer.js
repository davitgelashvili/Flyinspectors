import React from "react";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import PageLinks from "./PageLinks";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={`${styles.footer} `}>
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className={`${styles.footer__left} `}>
              <Logo />
              <SocialMedia />
            </div>
          </div>
          <div className="col-lg-9 align-items-center">
            <PageLinks />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
