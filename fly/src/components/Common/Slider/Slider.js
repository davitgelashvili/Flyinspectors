import { getHero } from '@/api/serverApi';
import { LOCALES, DEFAULT_LOCALE } from '@/i18n/locales';
import styles from './Slider.module.scss';
import HeroText from './HeroText';
import CompensationCard from './CompensationCard';

// მთავარი გვერდის hero. სრულად სერვერ კომპონენტია (ქვემოთ HeroText და
// CompensationCard-იც): ტექსტი ბაზიდან სერვერზე იკითხება და მზა HTML-ში ჩაისმება,
// ამიტომ Google-ი მას JavaScript-ის გარეშე ხედავს. შედეგი 60 წამით იკეშება.
//
// მხოლოდ მთავარ გვერდზე უნდა იდგეს: მას ერთადერთი <h1> აქვს და სხვა გვერდებზე
// იგივე ტექსტის გამეორება განმეორებადი კონტენტი იქნებოდა.
async function Slider({ lang }) {
    const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
    const hero = await getHero();

    return (
        <section className={styles.slider} aria-labelledby="hero-title">
            <div className={styles.slider__inner}>
                <HeroText hero={hero} locale={locale} />
                <CompensationCard locale={locale} />
            </div>
        </section>
    );
}

export default Slider;
