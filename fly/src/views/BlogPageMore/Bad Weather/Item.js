import styles from "./BadWeather.module.scss";
import image from "../../../assetss/Blog Page/1/3-1024x573.jpg";
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
          Weather conditions are the most common reasons for flight delay or
          cancellation. It can be a very good weather, sunny and dry where you
          are, but strong wind and storm in the place which is your destination.
          Such weather conditions make the plane stay on the ground and
          interrupt planned flight.
        </p>
      </div>
    </div>
  );
};

export default Item;
