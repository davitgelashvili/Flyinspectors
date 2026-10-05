import Item from "./Item.js";
import styles from "./LackOfAircraft.module.scss";

const LackOfAircraft = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <h3 className={styles.services__header}>Lack of Aircraft</h3>
        <div className="row">
          <Item />
        </div>
      </div>
    </div>
  );
};

export default LackOfAircraft;
