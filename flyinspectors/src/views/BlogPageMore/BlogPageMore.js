import BadWeather from "./Bad Weather/BadWeather";
import CancelledFlights from "./CancelledFlights/CancelledFlights";
import LackOfAircraft from "./Lack of aircraft/LackOfPassengers";
import LackOfPassengers from "./Lack of passengers/LackOfPassengers";
import MechanicalIssues from "./Mechanical Issues/MechanicalIssues";

function BlogPageMore() {
  return (
    <div>
      <CancelledFlights />
      <MechanicalIssues />
      <BadWeather />
      <LackOfPassengers />
      <LackOfAircraft />
    </div>
  );
}

export default BlogPageMore;
