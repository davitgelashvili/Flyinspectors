import Item from "./Item.js";
import styles from "./WhyWe.module.scss";
import cover from '../../assetss/images/rb_2148.png'
import SectionCover from "../SectionTextAndCover/SectionCover.js";

const WhyWe = () => {
  return (
    <div className={styles.services}>
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <SectionCover image={cover}/>
            {/* <img src={cover} alt="cover" className={styles.services__cover} /> */}
          </div>
          <div className="col-lg-8">
            <Item />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyWe;
