import styles from "./Spain.module.scss";
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
          One of the two largest airports in Europe based on sheer size,
          Terminal 4 at Madrid-Barajas is the crown jewel. With angular
          architecture, flowing dome roofs, circular ceiling windows, and giant
          cross beams, Terminal 4 is a modern wonder.
        </p>
      </div>
    </div>
  );
};

export default Item;
