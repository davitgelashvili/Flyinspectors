import CompensationIf from "./CompensationIf/CompensationIf";
import BeAware from "../FlightDelay/BeAware/BeAware";
import CompensationInfo from "./CompensationInfo/CompensationInfo";
import TableJust from "./TableJust/TableJust";
import styles from "./MissedConnection.module.scss"


function MissedConnection() {
  return (
    <div className={styles.MainContainer}>
      <CompensationInfo />
      <CompensationIf />
      <TableJust/>

    <BeAware/>
    </div>
  );
}

export default MissedConnection;
