import Item from "./Item.js";
import styles from "./DocPrivacy.module.scss";

const DocPrivacy = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <div className="">
          <div className={`${styles.services__item}`}>
            
            <Item />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocPrivacy;
