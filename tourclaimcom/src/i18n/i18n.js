import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import SubmitLinkModule from "../components/UI/SubmitLink.module";
import FormModule from "../components/Form/Form.module";
i18n
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        resources: {
            en: {
                translation: {
                    ...SubmitLinkModule.en,
                    ...FormModule.en,
                }
            },
            ka: {
                translation: {
                    ...SubmitLinkModule.ka,
                    ...FormModule.ka,
                }
            }
        }
    })

export default i18n