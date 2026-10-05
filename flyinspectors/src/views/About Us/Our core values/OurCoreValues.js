'use client'

import Item from "./Item"
import styles from './OurCoreValues.module.scss'
import { useTranslation } from "react-i18next";

const OurCoreValues = () => {
    const {t} = useTranslation()
    const data = [
        {
            title: t('OurCoreValues._1.title'),
            desc: t('OurCoreValues._1.desc'),
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733136703/ic_poll_24px_n6jrcg.png"
        },
        {
            title: t('OurCoreValues._2.title'),
            desc: t('OurCoreValues._2.desc'),
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733136704/ic_schedule_24px_semyyr.png"
        },
        {
            title: t('OurCoreValues._3.title'),
            desc: t('OurCoreValues._3.desc'),
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733136705/ic_verified_user_24px_h326gi.png"
        },
        {
            title: t('OurCoreValues._4.title'),
            desc: t('OurCoreValues._4.desc'),
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733136701/ic_description_24px_hjqd5t.png"
        },
        {
            title: t('OurCoreValues._5.title'),
            desc: t('OurCoreValues._5.desc'),
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733136702/ic_local_atm_24px_r3kleu.png"
        },
        {
            title: t('OurCoreValues._6.title'),
            desc: t('OurCoreValues._6.desc'),
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733136701/ic_description_24px_hjqd5t.png"
        },
        {
            title: t('OurCoreValues._7.title'),
            desc: t('OurCoreValues._7.desc'),
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1733136701/ic_gavel_24px_tlp2cv.png"
        },
    ];
    return (
        <div className={styles.OptionsSection}>
                <h3 className={styles.title}>{t('OurCoreValues.title')}</h3>
            <div className="container" >
                <div className="row d-flex justify-content-center">
                    {data?.map((item)=>{
                        return (
                            <div className="col-lg-4"  key={item.title}>
                                <Item title={item.title} desc={item.desc} icon={item.icon}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default OurCoreValues



  