'use client'

import React from "react";
import styles from "./CancelledFlights.module.scss";
import Link from '@/components/UI/LocaleLink'
import image from "../../../components/Images/AirplaneImageWithLogo.png";
import { useTranslation } from "react-i18next";

const CancelledFlights = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.services}>
      <div className="container">
        <div className={styles.mainDiv}>
          <div>
            <img
              className={styles.mainDiv__image}
              src={image}
              alt={t("cancelledflights.imageAlt")}
            />
          </div>
          <div className={styles.mainDiv__textArea}>
            <h3 className={styles.services__header}>{t("cancelledflights.header")}</h3>
            <p className={styles.mainDiv__text}>{t("cancelledflights.text")}</p>
            <button type="button" className={styles.button}>
              <Link href="/about-us/blog-page-more" className={styles.link}>
                {t("cancelledflights.read")}
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelledFlights;