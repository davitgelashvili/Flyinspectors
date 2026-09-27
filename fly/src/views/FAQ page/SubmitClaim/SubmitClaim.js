import Item from "./Item.js";
import styles from "./SubmitClaim.module.scss";
import image from "../../../components/Images/SubmitPic.png";

const SubmitClaim = () => {
  return (
    <div>
      <div className={`${styles.services} container`}>
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

export default SubmitClaim;
