import Slider from "../../components/Common/Slider/Slider";
import OptionsSection from "../../components/OptionsSection/OptionsSection";
import ServicesOptions from "../../components/ServicesOptions/ServicesOptions";
import WhyWe from "../../components/WhyWe/WhyWe";
import WeGivesYou from "../../components/WeGivesYou/WeGivesYou";
import KnowsYourRights from "../../components/Knows Your Rights/components/KnowsYourRights";
import FaqSection from "../../components/Main/FaqSection/FaqSection";

function Main({ lang }) {
  return (
    <main>
      <Slider lang={lang} />
      <OptionsSection lang={lang} />
      <ServicesOptions lang={lang} />
      <WhyWe lang={lang} />
      <FaqSection />
      <WeGivesYou />
      <KnowsYourRights />
    </main>
  );
}

export default Main;
