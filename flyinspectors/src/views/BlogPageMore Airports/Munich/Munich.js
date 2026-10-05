import Item from "./Item.js";
import styles from "./Munich.module.scss";

const Munich = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <h3 className={styles.services__header}>
        Munich International Airport (Germany) — Ice rink        </h3>
        <div className="row">
          <Item />
        </div>
      </div>
    </div>
  );
};

export default Munich;
