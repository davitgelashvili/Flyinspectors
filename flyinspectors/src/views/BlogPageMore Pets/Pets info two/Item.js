import styles from "./PetsInfo.module.scss";
import image from "../../../assetss/Blog Page/3/Vaqcinacia-1024x573.jpg";
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
          All dogs and cats traveling within the European Union must be
          identified by an electronic chip. It should also possess a European
          passport. Provided and completed by an authorized veterinarian, the
          passport identifies your pet and certifies that it is properly
          vaccinated. We recommend that you check with the embassy of your
          destination country to learn more about national regulations. For
          example, for travel to Ireland, Sweden, the United Kingdom or Malta,
          additional sanitary conditions apply.
        </p>
      </div>
    </div>
  );
};

export default Item;
