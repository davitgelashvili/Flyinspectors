import styles from "./Usa.module.scss";
import image from "../../../assetss/Blog Page/2/Yoga-1024x573.jpg";
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
          San Francisco International Airport’s international terminal features
          a yoga room to offer its travelers a way to relax after a long
          overnight flight. There is also the SFO Library and Museum in the
          International Terminal that has exhibits and books on hand..
        </p>
      </div>
    </div>
  );
};

export default Item;
