'use client'

import { useTranslation } from "react-i18next";
import Item from "./Item";
import styles from './OptionsSection.module.scss';

const OptionsSection = () => {
    const { t } = useTranslation();

    // Static data with keys for translation
    const data = [
        {
            title: 'opensection.delay.title',
            desc: 'opensection.delay.desc',
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1732476179/ic_schedule_24px_1_tanbbs.svg"
        },
        {
            title: 'opensection.compensation.title',
            desc: 'opensection.compensation.desc',
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1732476178/ic_event_24px_d9o56u.svg"
        },
        {
            title: "opensection.missedconnectioncompensation.title",
            desc: "opensection.missedconnectioncompensation.desc",
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1732476178/ic_local_airport_24px_1_usunmk.svg"
        },
        {
            title: "opensection.overbookingcompensation.title",
            desc: "opensection.overbookingcompensation.desc",
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1732476178/ic_group_24px_kortma.svg"
        },
        {
            title: "opensection.compensationfordeniedboarding.title",
            desc: "opensection.compensationfordeniedboarding.desc",
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1732476179/ic_not_interested_24px_cgrdlv.svg"
        },
        {
            title: "opensection.delayedbaggagecompensation.title",
            desc: "opensection.delayedbaggagecompensation.desc",
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1732476180/ic_work_24px_kobici.svg"
        },
    ];

    return (
        <div className={styles.OptionsSection}>
            <h3 className={styles.title}>{t('opensection.sectionTitle')}</h3>
            <div className="container">
                <div className="row">
                    {data.map((item, index) => (
                        <div className="col-lg-4" key={index}>
                            <Item
                                title={t(item.title)}
                                desc={t(item.desc)}
                                icon={item.icon}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OptionsSection;