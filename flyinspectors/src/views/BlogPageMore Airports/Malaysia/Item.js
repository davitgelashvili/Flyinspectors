import styles from "./Malaysia.module.scss";
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
          One of the world’s busiest airports since it opened in 1998, travelers
          are often amazed at the Jungle Boardwalk and the palm trees inside the
          Satellite Terminal gardens, which are encased in circular glass.
        </p>
      </div>
    </div>
  );
};

export default Item;
