'use client'

import React, { useEffect, useState } from "react";
import styles from "./ContactUs.module.scss";
import { useTranslation } from "react-i18next";

const ContactList = ({ contact }) => {
  const windowUrl = typeof window !== 'undefined' ? window.location.hostname : ''
  const [lang,setLang] = useState(true)
  const data = contact
  const {t} = useTranslation()
  const list = [
    {
      country: t('ContactUs.georgia'),
      cards: [
        {
          label: t('ContactUs.mob'),
          value: data?.call?.ka          ,
          icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733137843/ic_call_24px_cnlpgo.png",
        },
        {
          label: t('ContactUs.email'),
          value: data?.email?.ka,
          icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733137844/ic_markunread_24px_x9usk2.png",
        },
        {
          label: t('ContactUs.address'),
          value: data?.address?.ka,
          icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733137844/ic_room_24px_hoqod0.png",
        },
      ],
    },
    {
      country: t('ContactUs.ireland'),
      cards: [
        {
          label: t('ContactUs.mob'),
          value: data?.call?.en,
          icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733137843/ic_call_24px_cnlpgo.png",
        },
        {
          label: t('ContactUs.email'),
          value: data?.email?.en,
          icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733137844/ic_markunread_24px_x9usk2.png",
        },
        {
          label: t('ContactUs.address'),
          value: data?.address?.en,
          icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733137844/ic_room_24px_hoqod0.png",
        },
      ],
    },
  ];

  useEffect(()=> {
    if(windowUrl == 'flyinspectors.com'){
      setLang(true)
    }
    
    if(windowUrl == 'flyinspectors.ge'){
      setLang(true)
    }
    
    if(windowUrl == 'flyinspectors.co.uk'){
      setLang(false)
    }

    if(windowUrl == 'localhost'){
      setLang(true)
    }

    if(windowUrl == '127.0.0.1'){
      setLang(false)
    }

  }, [windowUrl])

  return (
    <>
      {lang ? (
        <>
        <div className={`col-lg-6`}>
          <div>
            <h3 className={""}>{list[0].country}</h3>
            {list[0].cards.map((card, cardIndex) => (
              <div
                className={`${styles.item} d-flex align-items-center`}
                key={cardIndex}
              >
                <div className={styles.icon}>
                  <img src={card.icon} alt="icon" />
                </div>
                <div className={styles.text}>
                  <h5 className={styles.title}>{card.label}</h5>
                  <p className={styles.desc}>{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`col-lg-6`}>
          <div>
            <h3 className={""}>{list[1].country}</h3>
            {list[1].cards.map((card, cardIndex) => (
              <div
                className={`${styles.item} d-flex align-items-center`}
                key={cardIndex}
              >
                <div className={styles.icon}>
                  <img src={card.icon} alt="icon" />
                </div>
                <div className={styles.text}>
                  <h5 className={styles.title}>{card.label}</h5>
                  <p className={styles.desc}>{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
        
      ) : (
        <div className={`col-lg-6`}>
          <div>
            <h3 className={""}>{list[1].country}</h3>
            {list[1].cards.map((card, cardIndex) => (
              <div
                className={`${styles.item} d-flex align-items-center`}
                key={cardIndex}
              >
                <div className={styles.icon}>
                  <img src={card.icon} alt="icon" />
                </div>
                <div className={styles.text}>
                  <h5 className={styles.title}>{card.label}</h5>
                  <p className={styles.desc}>{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ContactList;
