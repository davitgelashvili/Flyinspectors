import Item from "./Item.js";
import styles from "./FeesAndPayout.module.scss";
import image from "../../../components/Images/PayMethods.png";

const FeesAndPayout = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <div className="">
    
          <div className={`${styles.services__item}`}>
        
            <Item />
          </div>
        </div>
        {/* <img src={image} className={styles.services__image} alt="PayMethods" /> */}
      </div>
    </div>
  );
};

export default FeesAndPayout;
