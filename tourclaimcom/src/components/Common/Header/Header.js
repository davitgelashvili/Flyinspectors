import Logo from "./Logo/Logo";
import styles from './Header.module.scss'
import SubmitLink from "../../UI/SubmitLink";
import BurgerMenu from "./Menu/BurgerMenu";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import i18n from "../../../i18n/i18n";
import Language from "./Language/Language";
import iconMenu from "../../Images/iconMenu.png";
import { siteTranslateAction } from "../../../store/translate";
import MetaTags from "../../../MetaTags";
import coverEn from '../../../assetss/images/meta_en.jpg'
import coverKa from '../../../assetss/images/meta_ka.jpg'

function Header() {
    const dispatch = useDispatch()
    const [metaData, setMetaData] = useState('')
    let {language}  = useSelector(state => state.translate)
    const windowUrl =  window.location.hostname
    const domain = windowUrl.replace(/^www\./, '');
    const [languageBtn, setLanguageBtn] = useState(true);
    const [IsOpen, setIsOpen] = useState(false);

    useEffect(()=> {
        if(windowUrl == 'flyinspectors.com'){
            dispatch(siteTranslateAction.changeLanguage('en'))
            setMetaData({
                title:'Flight compensation of up to 600 euros - Flyinspectors',
                description:'Get flight compensation of up to 600 euros in case of flight delay, cancellation, missed connection, denied boarding, lost or damaged luggage.',
                image: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1734813470/meta_en_zr0fxe.jpg',
                name:windowUrl,
            })
        }
        
        if(windowUrl == 'flyinspectors.ge'){
            dispatch(siteTranslateAction.changeLanguage('ka'))
            setMetaData({
                title:'ფრენის კომპენსაცია 600 ევრომდე',
                description:'მიიღეთ ფრენის კომპენსაცია, დაგვიანებული, გადადებული, დამაკავშირებელი რეისის გამოტოვების, ბარგის დაზიანება დაკარგვის შემთხვევაში',
                image:'https://res.cloudinary.com/dluqxr8lw/image/upload/v1734813470/meta_ka_sj6vvs.jpg',
                name:windowUrl,
            })
        }
        
        if(windowUrl == 'flyinspectors.co.uk'){
            setLanguageBtn(false)
            dispatch(siteTranslateAction.changeLanguage('en'))
            setMetaData({
                title:'Flight compensation of up to 600 euros - Flyinspectors',
                description:'Get flight compensation of up to 600 euros in case of flight delay, cancellation, missed connection, denied boarding, lost or damaged luggage.',
                image: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1734813470/meta_en_zr0fxe.jpg',
                name:windowUrl,
            })
        }
    
        if(windowUrl == 'localhost'){
            dispatch(siteTranslateAction.changeLanguage('en'))
            setMetaData({
                title:'Flight compensation of up to 600 euros - Flyinspectors',
                description:'Get flight compensation of up to 600 euros in case of flight delay, cancellation, missed connection, denied boarding, lost or damaged luggage.',
                image: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1734813470/meta_en_zr0fxe.jpg',
                name:windowUrl,
            })
        }
    
        if(windowUrl == '127.0.0.1'){
            setLanguageBtn(false)
            dispatch(siteTranslateAction.changeLanguage('ka'))
            setMetaData({
                title:'Flight compensation of up to 600 euros - Flyinspectors',
                description:'Get flight compensation of up to 600 euros in case of flight delay, cancellation, missed connection, denied boarding, lost or damaged luggage.',
                image: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1734813470/meta_en_zr0fxe.jpg',
                name:windowUrl,
            })
        }

      }, [dispatch, windowUrl])

      useEffect(()=>{
        i18n.changeLanguage(language)
      }, [language])

    // useEffect(() => {
    //     i18n.changeLanguage(language)
    //     if (windowUrl === 'flyinpectors.com' || windowUrl === 'flyinpectors.ge') {
    //         setLanguageBtn(true)
    //     }

    //     if (windowUrl === 'localhost:3000') {
    //         setLanguageBtn(true)
    //     }
    // }, [dispatch, language])

    const toggleMenu = () => {
        setIsOpen(!IsOpen);
    };

    return (
        <>
            <MetaTags
                title={metaData.title}
                description={metaData.description}
                image={metaData.image}
                name={metaData.name}
                />
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.header__content}>
                        <Logo />
                        <BurgerMenu setIsOpen={setIsOpen} IsOpen={IsOpen} />
                        <div className={styles.header__right} >
                            <SubmitLink className={styles.header__submitlink} />
                            {
                                languageBtn && (
                                    <Language language={language}/>
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
