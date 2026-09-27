'use client'

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./FeesAndPayout.module.scss";

const Item = () => {
  const { t } = useTranslation(); // Import the translation function
  const [activeIndex, setActiveIndex] = useState(null); // Track the active collapse index

  const toggleCollapse = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Create the data array dynamically using translations
  const data = [
    {
      title: t("fessand.title1"),
      desc: t("fessand.desc1"),
    },
    {
      title: t("fessand.title2"),
      desc: t("fessand.desc2"),
    },
    {
      title: t("fessand.title3"),
      desc: t("fessand.desc3"),
    },
    {
      title: t("fessand.title4"),
      desc: t("fessand.desc4"),
      points: [
        t("fessand.points4.pn1"),
        t("fessand.points4.pn2"),
        t("fessand.points4.pn3"),
      ],
    },
    {
      title: t("fessand.title5"),
      desc: t("fessand.desc5"),
    },
    {
      title: t("fessand.title6"),
      desc: t("fessand.desc6"),
      points: [
        t("fessand.points6.pn1"),
        t("fessand.points6.pn2"),
        t("fessand.points6.pn3"),
        t("fessand.points6.pn4"),
      ],
    },
    {
      title: t("fessand.title7"),
      desc: t("fessand.desc7"),
      // points: [
      //   t("fessand.points7.pn1"),
      //   t("fessand.points7.pn2"),
      // ],
    },
  ];

  // Header translation
  const header = t("fessand.header");

  return (
    <div>
      <h4 className={styles.services__header}>{header}</h4>
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
              {item.points && (
                <ul>
                  {item.points.map((point, pointIndex) => (
                    <li key={pointIndex}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Item;