import Item from "./Item.js";
import styles from "./China.module.scss";

const China = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <h3 className={styles.services__header}>
          Hong Kong International Airport (Hong Kong SAR, China) — Aviation
          Museum
        </h3>
        <div className="row">
          <Item />
        </div>
      </div>
    </div>
  );
};

export default China;
