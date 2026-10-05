'use client'

import Item from "./Item.js";
import styles from "./AboutPilots.module.scss";
import Link from '@/components/UI/LocaleLink'
import image from "../../../components/Images/AirplaneImageWithLogo.png";
import { useTranslation } from "react-i18next";

const AboutPilots = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.services}>
      <div className="container">
        <div className={styles.mainDiv}>
          <div>
            <img
              className={styles.mainDiv__image}
              src={image}
              alt={t("aboutpilots.imageAlt")}
            />
          </div>
          <div className={styles.mainDiv__textArea}>
            <h3 className={styles.services__header}>
              {t("aboutpilots.header")}
            </h3>
            <p className={styles.mainDiv__text}>
              {t("aboutpilots.text")}
            </p>
            <button type="button" className={styles.button}>
              <Link href="/about-us/blog-page-more-pilots" className={styles.link}>
                {t("aboutpilots.read")}
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPilots;
