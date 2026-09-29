import { getOptions } from '@/api/serverApi';
import { LOCALES, DEFAULT_LOCALE } from '@/i18n/locales';
import translations from './opensection.module';
import Item from './Item';
import styles from './OptionsSection.module.scss';

// ნაგულისხმევი ბარათები: თარგმანის ფაილში არსებული რიგით
const DEFAULT_KEYS = [
    'delay',
    'compensation',
    'missedconnectioncompensation',
    'overbookingcompensation',
    'compensationfordeniedboarding',
    'delayedbaggagecompensation',
];

// სერვერ კომპონენტია: ტექსტი ბაზიდან სერვერზე იკითხება და მზა HTML-ში ჩაისმება,
// ამიტომ Google-ი მას JavaScript-ის გარეშე ხედავს. შედეგი 60 წამით იკეშება.
// ბაზა თუ ცარიელია (ან ბექი მიუწვდომელია), იგივე ბარათები თარგმანებიდან ჩანს.
const OptionsSection = async ({ lang }) => {
    const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
    const defaults = translations[locale].opensection;
    const saved = await getOptions();

    // ბარათი, რომელსაც ამ ენაზე სათაური არ აქვს, ამ ენის გვერდზე არ ჩანს
    const savedItems = (Array.isArray(saved?.items) ? saved.items : [])
        .map((item) => ({
            key: item._id,
            title: item.title?.[locale]?.trim(),
            desc: item.desc?.[locale]?.trim(),
        }))
        .filter((item) => item.title);

    const items = savedItems.length
        ? savedItems
        : DEFAULT_KEYS.map((key) => ({
            key,
            title: defaults[key].title,
            desc: defaults[key].desc,
        }));

    const sectionTitle = saved?.sectionTitle?.[locale]?.trim() || defaults.sectionTitle;

    return (
        <section className={styles.OptionsSection}>
            <div className={styles.OptionsSection__inner}>
                <h2 className={styles.title}>{sectionTitle}</h2>
                <div className={styles.grid}>
                    {items.map((item) => (
                        <Item key={item.key} title={item.title} desc={item.desc} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OptionsSection;
