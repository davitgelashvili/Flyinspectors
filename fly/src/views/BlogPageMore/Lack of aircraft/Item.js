import styles from "./LackOfAircraft.module.scss";
import image from "../../../assetss/Blog Page/1/5-1024x573.jpg";
const Item = () => {
  return (
    <div className={styles.mainDiv}>
      <div className="imageDiv column">
        <img
          className={styles.mainDiv__image}
          src={image}
          alt="Airplane image with logo"
        />
        <p className={styles.mainDiv__text}>
          Flying a plane is very expensive. There are several payments and fees
          which has the airline, like fuel and vehicles and etc. So, if the
          number of empty seats in the plane is big, the flight probably gets
          cancelled.
        </p>
      </div>
    </div>
  );
};

export default Item;
