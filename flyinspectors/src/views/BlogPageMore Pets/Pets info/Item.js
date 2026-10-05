import styles from "./PetsInfo.module.scss";
import image from "../../../assetss/Blog Page/3/PetsInPlanes.jpg";
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
          Everyone wants to travel with their pets, here are some tips, how to
          avoid problems while traveling.
        </p>
      </div>
    </div>
  );
};

export default Item;
