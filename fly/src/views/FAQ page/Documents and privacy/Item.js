'use client'

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./DocPrivacy.module.scss";

const Item = () => {
  const { t } = useTranslation(); // Import the translation hook
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleCollapse = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Create data using the translation keys
  const data = [
    {
      title: t("Docprivacy.title1"),
      desc: t("Docprivacy.desc1"),
    },
    {
      title: t("Docprivacy.title2"),
      desc: t("Docprivacy.desc2"),
    },
    {
      title: t("Docprivacy.title3"),
      desc: t("Docprivacy.desc3"),
    },
    {
      title: t("Docprivacy.title4"),
      desc: t("Docprivacy.desc4"),
    },
  ];



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
            className={`${styles.collapse} ${activeIndex === index ? styles.expanded : styles.collapsed
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