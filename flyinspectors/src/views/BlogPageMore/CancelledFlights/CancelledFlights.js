import Item from "./Item.js";
import styles from "./CancelledFlights.module.scss";

const CancelledFlights = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <h3 className={styles.services__header}>The most common reasons why the flights get cancelled</h3>
        <div className="row">
          <Item />
        </div>
      </div>
    </div>
  );
};

export default CancelledFlights;
