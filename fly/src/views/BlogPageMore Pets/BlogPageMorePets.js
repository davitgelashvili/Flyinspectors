import Slider from "../../components/Common/Slider/Slider";
import PetsInfoThree from "./Pets info three/PetsInfo";
import PetsInfoTwo from "./Pets info two/PetsInfo";
import PetsInfo from "./Pets info/PetsInfo";


function BlogPageMorePets() {
  return (
    <div>
      <Slider />
      <PetsInfo/>
      <PetsInfoTwo/>
      <PetsInfoThree/>
    </div>
  );
}

export default BlogPageMorePets;
