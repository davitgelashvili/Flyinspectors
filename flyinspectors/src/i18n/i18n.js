import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import header from '../components/Common/Header/header.module'
import CompensationInfoModule from "../views/FlightDelay/CompensationInfo/CompensationInfo.module";
import CompensationIfModule from "../views/FlightDelay/CompensationIf/CompensationIf.module";
import CompensationHowMuchModule from "../views/FlightDelay/CompensationHowMuch/CompensationHowMuch.module";
import BeAwareModule from "../views/FlightDelay/BeAware/BeAware.module";
import FlightCancellationCompensationInfo from "../views/FlightCancellation/CompensationInfo/CompensationInfo.module";
import FlightCancellationCompensationif from "../views/FlightCancellation/CompensationIf/CompensationIf.module";
import FlightCancellationCompensationHowMuch from "../views/FlightCancellation/CompensationHowMuch/CompensationHowMuch.module";
import FlightCancellationBeAware from "../views/FlightCancellation/BeAware/BeAware.module";

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
import AboutPilots from "../views/Blog page/About Pilots/aboutpilots.module";
import cancelledflightsModule from "../views/Blog page/CancelledFlights/cancelledflights.module";
import MechanicalIssues from "../views/Blog page/Mechanical Issues/machanical.module";
import PetsInPlanes from "../views/Blog page/Pets in planes/petsinplanes.module";

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        resources: {
            en: {
                translation: {
                    ...header.en,

                    ...CompensationInfoModule.en,
                    ...CompensationIfModule.en,
                    ...CompensationHowMuchModule.en,
                    ...BeAwareModule.en,

                    ...FlightCancellationCompensationInfo.en,
                    ...FlightCancellationCompensationif.en,
                    ...FlightCancellationCompensationHowMuch.en,
                    ...FlightCancellationBeAware.en,

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


                    ...AboutPilots.en,
                    ...cancelledflightsModule.en,
                    ...MechanicalIssues.en,
                    ...PetsInPlanes.en,


                }
            },
            ka: {
                translation: {
                    ...header.ka,

                    ...CompensationInfoModule.ka,
                    ...CompensationIfModule.ka,
                    ...CompensationHowMuchModule.ka,
                    ...BeAwareModule.ka,

                    ...FlightCancellationCompensationInfo.ka,
                    ...FlightCancellationCompensationif.ka,
                    ...FlightCancellationCompensationHowMuch.ka,
                    ...FlightCancellationBeAware.ka,

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


                    ...AboutPilots.ka,
                    ...cancelledflightsModule.ka,
                    ...MechanicalIssues.ka,
                    ...PetsInPlanes.ka,

                }
            }
        }
    })

export default i18n