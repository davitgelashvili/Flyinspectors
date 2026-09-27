import Item from "./Item.js";
import styles from "./Usa.module.scss";

const Usa = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <h3 className={styles.services__header}>
          San Francisco International Airport, International Terminal (U.S.A.) —
          Yoga Room
        </h3>
        <div className="row">
          <Item />
        </div>
      </div>
    </div>
  );
};

export default Usa;
