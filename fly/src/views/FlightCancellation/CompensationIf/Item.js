import styles from "./CompensationIf.module.scss";

const Item = () => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.header}>Destination/Airline origin</th>
          <th className={styles.header}>Registered in EU</th>
          <th className={styles.header}>Registered outside EU</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={styles.cell}>From EU to EU</td>
          <td className={styles.cell}>Compensable</td>
          <td className={styles.cell}>Compensable</td>
        </tr>
        <tr>
          <td className={styles.cell}>From EU to outside EU</td>
          <td className={styles.cell}>Compensable</td>
          <td className={styles.cell}>Compensable</td>
        </tr>
        <tr>
          <td className={styles.cell}>From outside EU to EU</td>
          <td className={styles.cell}>Compensable</td>
          <td className={styles.cell}>Not Compensable</td>
        </tr>
        <tr>
          <td className={styles.cellLast}>From outside EU to outside EU</td>
          <td className={styles.cellLast}>Not Compensable</td>
          <td className={styles.cellLast}>Not Compensable</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Item;
