'use client'

import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { siteTranslateAction } from "../../../../store/translate";
import { withLocale } from "@/i18n/locales";
import styles from "./Language.module.scss";

const LANGS = [
    { code: "ka", label: "KA" },
    { code: "en", label: "EN" },
];

const Language = ({ language }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const switchTo = (lang) => {
        if (lang === language) return;
        dispatch(siteTranslateAction.changeLanguage(lang));
        router.push(withLocale(pathname, lang));
    };

    return (
        <div className={styles.language}>
            {LANGS.map(({ code, label }) => (
                <button
                    key={code}
                    type="button"
                    aria-pressed={language === code}
                    onClick={() => switchTo(code)}
                    className={`${styles.language__btn} ${language === code ? styles["language__btn--active"] : ""}`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default Language;
