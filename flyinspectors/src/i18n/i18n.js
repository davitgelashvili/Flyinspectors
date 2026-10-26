import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import header from '../components/Common/Header/header.module'
import BeAwareModule from "../views/FlightDelay/BeAware/BeAware.module";

import AboutUsSectionModule from "../views/About Us/ABout Us Section/AboutUsSection.module";
import OurCoreValuesModule from "../views/About Us/Our core values/OurCoreValues.module";
import FeedBackCompModule from "../views/Contact Us/Feedback Form/FeedBackComp.module";

import OverBookedCompensationInfo from "../views/OverBookedFlight/CompensationInfo/CompensationInfo.module";
import OverBookedCompensationIfModule from "../views/OverBookedFlight/CompensationIf/CompensationIf.module";
import CompensationUSAModule from "../views/OverBookedFlight/CompensationUSA/CompensationUSA.module";
import CompensationEUModule from "../views/OverBookedFlight/CompensationEU/CompensationEU.module";
import OverBookedBeAwareModule from "../views/OverBookedFlight/BeAware/BeAware.module";
import MissedConnectionCompensationInfo from "../views/MissedConnection/CompensationInfo/CompensationInfo.module";
import MissedConnectionCompensationIfModule from "../views/MissedConnection/CompensationIf/CompensationIf.module";
import MissedConnectionCompensationUSAModule from "../views/MissedConnection/CompensationUSA/CompensationUSA.module";
import MissedConnectionCompensationEUModule from "../views/MissedConnection/CompensationEU/CompensationEU.module";
import MissedConnectionBeAwareModule from "../views/MissedConnection/BeAware/BeAware.module";
import LostLuggageModule from "../views/LostLuggage/LostLuggage.module";

import tableoneModule from "../components/Tables/tableone/tableone.module";
import tabletwoModule from "../components/Tables/tabletwo/tabletwo.module";
import tablethreeModule from "../components/Tables/tablethree/tablethree.module";
import tablefourModule from "../components/Tables/tablefour/tablefour.module";
import TablefiveModule from "../components/Tables/tablefive/Tablefive.module";

import SubmitLinkModule from "../components/UI/SubmitLink.module";
import FormModule from "../components/Form/Form.module";

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        resources: {
            en: {
                translation: {
                    ...header.en,

                    ...BeAwareModule.en,


                    ...AboutUsSectionModule.en,
                    ...OurCoreValuesModule.en,
                    ...FeedBackCompModule.en,

                    ...OverBookedCompensationInfo.en,
                    ...OverBookedCompensationIfModule.en,
                    ...CompensationUSAModule.en,
                    ...CompensationEUModule.en,
                    ...OverBookedBeAwareModule.en,
                    ...MissedConnectionCompensationInfo.en,
                    ...MissedConnectionCompensationIfModule.en,
                    ...MissedConnectionCompensationUSAModule.en,
                    ...MissedConnectionCompensationEUModule.en,
                    ...MissedConnectionBeAwareModule.en,
                    ...LostLuggageModule.en,

                    ...tableoneModule.en,
                    ...tabletwoModule.en,
                    ...tablethreeModule.en,
                    ...tablefourModule.en,
                    ...TablefiveModule.en,

                    ...SubmitLinkModule.en,
                    ...FormModule.en,




                }
            },
            ka: {
                translation: {
                    ...header.ka,

                    ...BeAwareModule.ka,


                    ...AboutUsSectionModule.ka,
                    ...OurCoreValuesModule.ka,
                    ...FeedBackCompModule.ka,

                    ...OverBookedCompensationInfo.ka,
                    ...OverBookedCompensationIfModule.ka,
                    ...CompensationUSAModule.ka,
                    ...CompensationEUModule.ka,
                    ...OverBookedBeAwareModule.ka,
                    ...MissedConnectionCompensationInfo.ka,
                    ...MissedConnectionCompensationIfModule.ka,
                    ...MissedConnectionCompensationUSAModule.ka,
                    ...MissedConnectionCompensationEUModule.ka,
                    ...MissedConnectionBeAwareModule.ka,
                    ...LostLuggageModule.ka,

                    ...tableoneModule.ka,
                    ...tabletwoModule.ka,
                    ...tablethreeModule.ka,
                    ...tablefourModule.ka,
                    ...TablefiveModule.ka,

                    ...SubmitLinkModule.ka,
                    ...FormModule.ka,



                }
            }
        }
    })

export default i18n