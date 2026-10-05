import Item from "./Item.js";
import styles from "./MechanicalIssues.module.scss";


const MechanicalIssues = () => {
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <h3 className={styles.services__header}>Mechanical Issues</h3>
        <div className="row">
            <Item />
        </div>
      </div>
    </div>
  );
};

export default MechanicalIssues;
