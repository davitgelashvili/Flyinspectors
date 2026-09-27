import CompensationIf from "./CompensationIf/CompensationIf";
import CompensationUSA from "./CompensationUSA/CompensationUSA";
import BeAware from "./BeAware/BeAware";
import CompensationInfo from "./CompensationInfo/CompensationInfo";
import TableJust from "./TableJust/TableJust";
import CompensationEU from "./CompensationEU/CompensationEU";
import styles from "./OverBooked.module.scss"


function OverBooked() {
  return (
    <div className={styles.MainContainer}>
      <CompensationInfo />
      <CompensationIf />
      <TableJust/>
      <div style={{marginBottom:"50px"}}>
      <CompensationUSA />
      </div>
      <CompensationEU/>
      <BeAware />
    </div>
  );
}

export default OverBooked;
