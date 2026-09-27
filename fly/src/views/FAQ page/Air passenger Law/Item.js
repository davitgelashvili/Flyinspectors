'use client'

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./PassLaw.module.scss";

const Item = () => {
  const { t } = useTranslation(); // Import the translation function
  const [activeIndex, setActiveIndex] = useState(null); // Track the active collapse index

  const toggleCollapse = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Create the data array dynamically using translations
  const data = [
    {
      title: t("pases.title1"),
      desc: t("pases.desc1"),
    },
    {
      title: t("pases.title2"),
      desc: t("pases.desc2"),
    },
    {
      title: t("pases.title3"),
      desc: t("pases.desc3"),
    },
    {
      title: t("pases.title4"),
      desc: t("pases.desc4"),
    },
    {
      title: t("pases.title5"),
      desc: t("pases.desc5"),
    },
  ];

  // Header translation
  const header = t("pases.header");

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>
          <div className={styles.itemContainer}>
            <button
              className={styles.toggleButton}
              onClick={() => toggleCollapse(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`collapseExample-${index}`}
            >
              {activeIndex === index ? "-" : "+"}
            </button>
            <h3 className={styles.question}>{item.title}</h3>
          </div>
          <div
            id={`collapseExample-${index}`}
            className={`${styles.collapse} ${
              activeIndex === index ? styles.expanded : styles.collapsed
            }`}
          >
            <div className={styles.card}>
              <p>{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Item;