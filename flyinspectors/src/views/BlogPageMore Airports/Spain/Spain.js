import Item from "./Item.js";
import styles from "./Spain.module.scss";

const Spain = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <h3 className={styles.services__header}>
          Adolfo Suárez Madrid–Barajas Airport (Spain)— Unique architecture
        </h3>
        <div className="row">
          <Item />
        </div>
      </div>
    </div>
  );
};

export default Spain;
