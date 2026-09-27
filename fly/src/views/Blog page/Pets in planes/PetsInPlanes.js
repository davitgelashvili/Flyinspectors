'use client'

import React from "react";
import Link from '@/components/UI/LocaleLink'
import { useTranslation } from "react-i18next";
import image from "../../../assetss/Blog Page/3/PetsInPlanes.jpg";
import styles from "./PetsInPlanes.module.scss";

const PetsInPlanes = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.services}>
      <div className="container">
        <div className={styles.mainDiv}>
          <div>
            <img
              className={styles.mainDiv__image}
              src={image}
              alt={t("petsinplanes.imageAlt", "Airplane image with logo")}
            />
          </div>
          <div className={styles.mainDiv__textArea}>
            <h3 className={styles.services__header}>{t("petsinplanes.header")}</h3>
            <p className={styles.mainDiv__text}>{t("petsinplanes.text")}</p>
            <button type="button" className={styles.button}>
              <Link href="/about-us/blog-page-more-pets" className={styles.link}>
                {t("petsinplanes.read")}
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetsInPlanes;