'use client'

import Logo from "./Logo/Logo";
import styles from './Header.module.scss'
import SubmitLink from "../../UI/SubmitLink";
import BurgerMenu from "./Menu/BurgerMenu";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import i18n from "../../../i18n/i18n";
import useLocale from "../../../i18n/useLocale";
import Language from "./Language/Language";
import iconMenu from "../../Images/iconMenu.png";
import { siteTranslateAction } from "../../../store/translate";

function Header() {
    const dispatch = useDispatch()
    const locale = useLocale()
    const [languageBtn, setLanguageBtn] = useState(true);
    const [IsOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (window.location.hostname === 'flyinspectors.co.uk') setLanguageBtn(false)
    }, [])

    useEffect(() => {
        dispatch(siteTranslateAction.changeLanguage(locale))
        i18n.changeLanguage(locale)
        document.documentElement.lang = locale
    }, [dispatch, locale])

    const toggleMenu = () => {
        setIsOpen(!IsOpen);
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.header__content}>
                        <Logo />
                        <BurgerMenu setIsOpen={setIsOpen} IsOpen={IsOpen} />
                        <div className={styles.header__right} >
                            <SubmitLink className={styles.header__submitlink} />
                            {
                                languageBtn && (
                                    <Language language={locale}/>
                                )
                            }
                            <div className={styles.header__burger} onClick={toggleMenu}>
                                <img src={iconMenu} alt="Menu" className={styles.iconMenu} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;
