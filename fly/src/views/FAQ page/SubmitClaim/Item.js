'use client'

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SubmitClaim.module.scss";

const Item = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null); // Track the active collapse index

  const toggleCollapse = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const data = [
    {
      title: t("SubmitClaim.title1"),
      desc: t("SubmitClaim.desc1"),
    },
    {
      title: t("SubmitClaim.title2"),
      desc: t("SubmitClaim.desc2"),
    },
    {
      title: t("SubmitClaim.title3"),
      desc: t("SubmitClaim.desc3"),
    },
    {
      title: t("SubmitClaim.title4"),
      desc: t("SubmitClaim.desc4"),
    },
    {
      title: t("SubmitClaim.title5"),
      desc: t("SubmitClaim.desc5"),
    },
    {
      title: t("SubmitClaim.title6"),
      desc: t("SubmitClaim.desc6"),
    },
    {
      title: t("SubmitClaim.title7"),
      desc: t("SubmitClaim.desc7"),
    },
    {
      title: t("SubmitClaim.title8"),
      desc: t("SubmitClaim.desc8"),
    },
    {
      title: t("SubmitClaim.title9"),
      desc: t("SubmitClaim.desc9"),
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