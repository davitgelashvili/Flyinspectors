import styles from "./CancelledFlights.module.scss";
import image from "../../../components/Images/BlogPageMorePic.png";
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
          Summer, vacations, holidays, these are periods when most people plan
          their dream trips. Everything is ready and only thing you have to do,
          is to go to the airport and get in your plane. What is the worst that
          may happen when you are going to start your trip? - Words on the huge
          screen: …..flight cancelled! Why happened so, that flights get
          cancelled?
        </p>
      </div>
    </div>
  );
};

export default Item;
