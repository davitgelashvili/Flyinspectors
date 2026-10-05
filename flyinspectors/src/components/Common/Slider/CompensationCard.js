import translations from './Slider.module';
import styles from './Slider.module.scss';

const TIERS = [
    { key: 'tier1', amount: '€250' },
    { key: 'tier2', amount: '€400' },
    { key: 'tier3', amount: '€600' },
];

// სერვერ კომპონენტია. მანძილი და თანხა <dl>-ია (ტერმინი — მნიშვნელობა),
// რომ საძიებო სისტემამ წყვილები ერთმანეთს დაუკავშიროს.
const CompensationCard = ({ locale }) => {
    const t = translations[locale].SliderHero;

    return (
        <aside className={styles.card} aria-labelledby="compensation-title">
            <h2 id="compensation-title" className={styles.card__title}>{t.cardTitle}</h2>
            <dl className={styles.card__list}>
                {TIERS.map(({ key, amount }) => (
                    <div key={key} className={styles.card__row}>
                        <dt className={styles.card__range}>{t[key]}</dt>
                        <dd className={styles.card__amount}>{amount}</dd>
                    </div>
                ))}
            </dl>
            <p className={styles.card__note}>{t.cardNote}</p>
        </aside>
    );
};

export default CompensationCard;
