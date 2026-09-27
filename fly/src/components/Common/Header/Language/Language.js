'use client'

import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import engFlag from "../../../../assetss/images/brtsh.jpg";
import geoFlag from "../../../../assetss/images/geo.jpg";
import { siteTranslateAction } from "../../../../store/translate";
import { withLocale } from "@/i18n/locales";

const flagStyle = {
    cursor: "pointer",
    height: "20px",
    border: "1px solid #ccc",
    borderRadius: "3px",
};

const Language = ({ language }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const switchTo = (lang) => {
        dispatch(siteTranslateAction.changeLanguage(lang));
        router.push(withLocale(pathname, lang));
    };

    return (
        <div style={{ marginLeft: "15px" }}>
            {language === "ka" ? (
                <img
                    src={engFlag}
                    alt="English"
                    onClick={() => switchTo("en")}
                    style={flagStyle}
                />
            ) : (
                <img
                    src={geoFlag}
                    alt="Georgian"
                    onClick={() => switchTo("ka")}
                    style={flagStyle}
                />
            )}
        </div>
    );
};

export default Language;
