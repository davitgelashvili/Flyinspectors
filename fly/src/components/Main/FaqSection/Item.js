'use client'

import React, { useState } from "react";
import styles from "./FaqSection.module.scss";
import { useTranslation } from "react-i18next";

const Item = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const {t} = useTranslation()

  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const items = [
    {
      header: t('faqsection.header1'),
      content: t('faqsection.content1')
    },
    {
      header: t('faqsection.header2'),
      content: t('faqsection.content2')
    },
    {
      header: t('faqsection.header3'),
      content: t('faqsection.content3'),
    },
  ];

  return (
    <div className={`${styles.accordion}`}>
      {items.map((item, index) => (
        <div key={index} className={styles.accordion__item}>
          <div
            className={`${styles.accordion__header}`}
            onClick={() => toggleAccordion(index)}
          >
            {item.header}
          </div>
          <div
            className={`${styles.accordion__content} ${
              activeIndex === index ? styles.show : ""
            }`}
          >
            <p className={styles.contentP}>{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Item;
