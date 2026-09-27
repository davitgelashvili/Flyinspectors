import Item from "./Item.js";
import styles from "./BadWeather.module.scss";

const BadWeather = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <h3 className={styles.services__header}>Bad Weather</h3>
        <div className="row">
          <Item />
        </div>
      </div>
    </div>
  );
};

export default BadWeather;
