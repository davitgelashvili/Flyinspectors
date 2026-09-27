import styles from "./Munich.module.scss";
import image from "../../../assetss/Blog Page/2/Ski-1024x573.jpg";
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
          There is no other airport in the world that supplies its travelers
          with both a brewery and giant ice rink. During Christmas the airport
          holds a winter market where travelers can skate around and then try
          various brews.
        </p>
      </div>
    </div>
  );
};

export default Item;
