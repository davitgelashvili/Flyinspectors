import styles from "./MechanicalIssues.module.scss";
import image from "../../../components/Images/AirportPhoto.png";
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
          Anything remotely out of sync in the aircraft will be cause for either
          delay or cancellation. Every part of the plane needs to be in perfect
          condition, so checking everything usually takes more time and it
          causes delay or cancellation.
        </p>
      </div>
    </div>
  );
};

export default Item;
