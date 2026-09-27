import styles from "./OurCoreValues.module.scss";

const Item = ({ title, desc, icon }) => {
  return (
    <div className={styles.item}>
      <div className={`${styles.item__head} d-flex align-items-center`}>
        <figure className={styles.item__icon}>
          <img
            src={icon}
            alt="icon"
            className={`${styles["item__icon--img"]}`}
          />
        </figure>
        <h3 className={styles.item__title}>{title}</h3>
      </div>
      <div className={styles.item__desc}>{desc}</div>
    </div>
  );
};

export default Item;
