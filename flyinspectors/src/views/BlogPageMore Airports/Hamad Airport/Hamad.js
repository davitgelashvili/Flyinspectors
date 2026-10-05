import Item from "./Item.js";
import styles from "./Hamad.module.scss";

const Hamad = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <h3 className={styles.services__header}>
          Hamad International Airport (Qatar) — Swimming pool{" "}
        </h3>
        <div className="row">
          <Item />
        </div>
      </div>
    </div>
  );
};

export default Hamad;
