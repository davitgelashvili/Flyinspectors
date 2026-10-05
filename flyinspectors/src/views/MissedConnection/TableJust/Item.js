import styles from "./TableJust.module.scss";

const Item = () => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.header}>Distance/Delay</th>
          <th className={styles.header}>3-4 hours</th>
          <th className={styles.header}>More than 4 hours</th>
          <th className={styles.header}>Cancelled Flight</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={styles.cell}>Less than 1500km</td>
          <td className={styles.cell}>EUR 250</td>
          <td className={styles.cell}>EUR 250</td>
          <td className={styles.cell}>EUR 250</td>
        </tr>
        <tr>
          <td className={styles.cell}>More than 1500km inside EU</td>
          <td className={styles.cell}>EUR 400</td>
          <td className={styles.cell}>EUR 400</td>
          <td className={styles.cell}>EUR 400</td>
        </tr>
        <tr>
          <td className={styles.cell}>1500-3500km ourside EU</td>
          <td className={styles.cell}>EUR 400</td>
          <td className={styles.cell}>EUR 400</td>
          <td className={styles.cell}>EUR 400</td>
        </tr>
        <tr>
          <td className={styles.cellLast}>More than 3500km outside EU</td>
          <td className={styles.cellLast}>EUR 300</td>
          <td className={styles.cellLast}>EUR 600</td>
          <td className={styles.cell}>EUR 600</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Item;
