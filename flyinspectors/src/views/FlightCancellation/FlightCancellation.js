import CompensationIf from "./CompensationIf/CompensationIf";
import CompensationHowMuch from "./CompensationHowMuch/CompensationHowMuch";
import BeAware from "./BeAware/BeAware";
import CompensationInfo from "./CompensationInfo/CompensationInfo";
import styles from "./FlightCancellation.module.scss"

function FlightCancellation() {
  return (
    <div className={styles.MainContainer}>
      <CompensationInfo />
      <CompensationIf />
      <CompensationHowMuch />
      <BeAware />
    </div>
  );
}

export default FlightCancellation;
