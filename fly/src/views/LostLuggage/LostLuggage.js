import CompensationIf from "./CompensationIf/CompensationIf";
import BeAware from "./BeAware/BeAware";
import CompensationInfo from "./CompensationInfo/CompensationInfo";
import styles from "./LostLuggage.module.scss"


function LostLuggage() {
  return (
    <div className={styles.MainContainer}>
      <CompensationInfo />
      <CompensationIf />
      <BeAware />
    </div>
  );
}

export default LostLuggage;
