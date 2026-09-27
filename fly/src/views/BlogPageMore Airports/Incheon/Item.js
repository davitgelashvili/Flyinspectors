import styles from "./Incheon.module.scss";
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
          Since opening in 2001, this has been rated one of the top airports in
          the world. Incheon International includes fascinating architecture and
          various gardens sprinkled throughout its terminals.
        </p>
      </div>
    </div>
  );
};

export default Item;
