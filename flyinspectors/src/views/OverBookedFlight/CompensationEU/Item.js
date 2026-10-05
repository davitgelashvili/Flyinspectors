import styles from "./CompensationEU.module.scss";

const Item = () => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.header}>Distance</th>
          <th className={styles.headerLg}>Compensation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={styles.cell}>Less than 1500 km all flight</td>
          <td className={styles.cell}>EUR 250</td>
        </tr>
        <tr>
          <td className={styles.cell}>More than 1500 km Domestic Flights</td>
          <td className={styles.cell}>EUR 400</td>
        </tr>
        <tr>
          <td className={styles.cell}>1500-3500 km International Flights</td>
          <td className={styles.cell}>EUR 400</td>
        </tr>
        <tr>
          <td className={styles.cell}>More than 3500 km International Flights</td>
          <td className={styles.cell}>EUR 600</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Item;
