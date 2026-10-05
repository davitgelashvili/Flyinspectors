import { getOptions } from '@/api/serverApi';
import { LOCALES, DEFAULT_LOCALE } from '@/i18n/locales';
import Item from './Item';
import styles from './OptionsSection.module.scss';

// სერვერ კომპონენტია: ტექსტი ბაზიდან სერვერზე იკითხება და მზა HTML-ში ჩაისმება,
// ამიტომ Google-ი მას JavaScript-ის გარეშე ხედავს. შედეგი 60 წამით იკეშება.
// ტექსტი მხოლოდ ბაზიდან მოდის (ადმინი → "კომპენსაციის ბარათები"): ფრონტში ნაგულისხმევი
// აღარ არის. ბარათის გარეშე სექცია საერთოდ არ ჩანს.
const OptionsSection = async ({ lang }) => {
    const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
    const saved = await getOptions();

    // ბარათი, რომელსაც ამ ენაზე სათაური არ აქვს, ამ ენის გვერდზე არ ჩანს
    const items = (Array.isArray(saved?.items) ? saved.items : [])
        .map((item) => ({
            key: item._id,
            title: item.title?.[locale]?.trim(),
            desc: item.desc?.[locale]?.trim(),
        }))
        .filter((item) => item.title);

    if (!items.length) return null;

    const sectionTitle = saved?.sectionTitle?.[locale]?.trim();

    return (
        <section className={styles.OptionsSection}>
            <div className={`container ${styles.OptionsSection__inner}`}>
                {sectionTitle && <h2 className={styles.title}>{sectionTitle}</h2>}
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
