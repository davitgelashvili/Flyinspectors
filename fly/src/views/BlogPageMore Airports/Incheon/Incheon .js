import Item from "./Item.js";
import styles from "./Incheon.module.scss";

const Incheon = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <h3 className={styles.services__header}>
          Incheon International Airport (South Korea) — Indoor Garden{" "}
        </h3>
        <div className="row">
          <Item />
        </div>
      </div>
    </div>
  );
};

export default Incheon;
