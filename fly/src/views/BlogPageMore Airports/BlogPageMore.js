import Slider from "../../components/Common/Slider/Slider";
import AirportList from "./Airportlist/AirportList";
import China from "./China/China";
import Hamad from "./Hamad Airport/Hamad";
import Incheon from "./Incheon/Incheon ";
import Malaysia from "./Malaysia/Malaysia";
import Munich from "./Munich/Munich";
import Spain from "./Spain/Spain";
import Usa from "./USA/Usa";

function BlogPageMoreAirports() {
  return (
    <div>
      <Slider />
      <AirportList />
      <Hamad />
      <Munich />
      <Incheon />
      <Malaysia />
      <Usa />
      <Spain />
      <China />
    </div>
  );
}

export default BlogPageMoreAirports;
