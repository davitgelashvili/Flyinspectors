import styles from "./PetsInfo.module.scss";
import image from "../../../assetss/Blog Page/3/Regulation-1024x573.jpg";
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
          For travel outside the European Union, be sure to consider the
          regulations enforced in both the originating and destination countries
          (vaccinations, quarantine, etc.). Air France declines all
          responsibility for any costs incurred (booking modification fees,
          hotel stay, kennel fees, etc.) in case your animal is refused
          transport due to non-compliance with our provisions, or in case your
          animal is refused upon arrival due to non-compliance with the
          provisions established by the country of destination.
        </p>
      </div>
    </div>
  );
};

export default Item;
