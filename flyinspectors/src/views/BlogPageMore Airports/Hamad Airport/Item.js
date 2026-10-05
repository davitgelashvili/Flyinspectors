import styles from "./Hamad.module.scss";
import image from "../../../assetss/Blog Page/2/Pool-1024x573.jpg";
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
          Opened in 2014, the Hamad International Airport features a 25 meter,
          temperature-controlled indoor lap pool. It is open to the public and
          for only $35 one can take advantage of the pool, gym and Jacuzzi.
        </p>
      </div>
    </div>
  );
};

export default Item;
