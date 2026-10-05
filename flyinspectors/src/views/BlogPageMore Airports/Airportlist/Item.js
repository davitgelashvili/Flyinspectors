import styles from "./AirportList.module.scss";
import image from "../../../assetss/Blog Page/2/Airport-1024x573.jpg";
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
          International air travel is normally a pretty stressful affair. We
          hustle just to get to the airport. Then we stand through long lines in
          both security and passport check, pass all necessary stages. These
          everything may be exhausting. But there are some airports out there
          that you may never want to leave. These airports were built to impress
          travelers, not just to shuttle them around the world. Let’s take a
          look at some of the coolest attractions at airports:
        </p>
      </div>
    </div>
  );
};

export default Item;
