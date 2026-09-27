import Item from "./Item.js";
import styles from "./BeAware.module.scss";
import image from "../../../components/Images/suitcase.png"
import SectionCover from "../../../components/SectionTextAndCover/SectionCover.js";

const BeAware = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <div className="row">
          <div className="col-lg-6 col-12">
            <SectionCover image={image} />
            {/* <img className={styles.image} src={image} alt="MonitorImage"></img> */}
          </div>
          <div className={`${styles.item} col-lg-6 col-12`}>
            <Item />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeAware;
