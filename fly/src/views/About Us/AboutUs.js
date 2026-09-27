import AboutUsSection from "./ABout Us Section/AboutUsSection";
import OurCoreValues from "./Our core values/OurCoreValues";
import RateSection from "./RateSection/RateSection";

function AboutUs({ lang }) {
  return (
    <div>
     <div style={{marginBottom:"20px"}}>
     <AboutUsSection />
     </div>
      <RateSection lang={lang} />
      <OurCoreValues />
     
    </div>
  );
}

export default AboutUs;
