import Item from "./Item.js";
import styles from "./Malaysia.module.scss";

const Malaysia = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <h3 className={styles.services__header}>
          Kuala Lumpur International Airport (Malaysia) — Jungle boardwalk
        </h3>
        <div className="row">
          <Item />
        </div>
      </div>
    </div>
  );
};

export default Malaysia;
