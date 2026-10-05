'use client'

import React from "react";
import styles from "./MechanicalIssues.module.scss";
import Link from '@/components/UI/LocaleLink'
import image from "../../../components/Images/TeamPic.png";
import { useTranslation } from "react-i18next";

const MechanicalIssues = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.services}>
      <div className="container">
        <div className={styles.mainDiv}>
          <div>
            <img
              className={styles.mainDiv__image}
              src={image}
              alt={t("mechanical.imageAlt", "Airplane image with logo")}
            />
          </div>
          <div className={styles.mainDiv__textArea}>
            <h3 className={styles.services__header}>{t("mechanical.header")}</h3>
            <p className={styles.mainDiv__text}>{t("mechanical.text")}</p>
            <button type="button" className={styles.button}>
              <Link href="/about-us/blog-page-more-airports" className={styles.link}>
                {t("mechanical.read")}
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicalIssues;