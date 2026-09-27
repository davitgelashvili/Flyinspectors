import styles from "./China.module.scss";
import image from "../../../assetss/Blog Page/2/Ski-1024x573.jpg";
const Item = () => {
  return (
    <div className={styles.mainDiv}>
      <div className="imageDiv column">
        {/* <img
          className={styles.mainDiv__image}
          src={image}
          alt="Airplane image with logo"
        /> */}
        <p className={styles.mainDiv__text}>
          Where do we begin with the Hong Kong International Airport? There’s an
          IMAX, virtual golf course, aromatherapy spa, and tons of shops inside.
          Oh, there’s also a small aviation museum complete with flight
          simulators called the Aviation Discovery Centre.
        </p>
      </div>
    </div>
  );
};

export default Item;
