import CancelledFlights from "./CancelledFlights/CancelledFlights";
import MechanicalIssues from "./Mechanical Issues/MechanicalIssues";
import Slider from "../../components/Common/Slider/Slider";
import PetsInPlanes from "./Pets in planes/PetsInPlanes";
import AboutPilots from "./About Pilots/AboutPilots";

function BlogPage() {
  return (
    <div>
      <Slider />
      <CancelledFlights />
      <MechanicalIssues />
      <PetsInPlanes />
      <AboutPilots />
    </div>
  );
}

export default BlogPage;
