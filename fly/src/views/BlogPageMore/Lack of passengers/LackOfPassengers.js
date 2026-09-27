import Item from "./Item.js";
import styles from "./LackOfPassengers.module.scss";

const LackOfPassengers = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <h3 className={styles.services__header}>Lack of passengers</h3>
        <div className="row">
          <Item />
        </div>
      </div>
    </div>
  );
};

export default LackOfPassengers;
