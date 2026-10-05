import styles from "./CompensationUSA.module.scss";

const Item = () => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.header}>Distance/Delay</th>
          <th className={styles.headerLg}>1-2 hours</th>
          <th className={styles.header}>2-4 hours</th>
          <th className={styles.header}>More Than 4 hours</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={styles.cell}>Domestic</td>
          <td className={styles.cell}>200% of the cost of oneway ticket - no more than 675 USD</td>
          <td className={styles.cell}>400% of the cost of oneway ticket - no more than 1350 USD</td>
          <td className={styles.cell}>400% of the cost of oneway ticket - no more than 1350 USD</td>
        </tr>
        <tr>
          <td className={styles.cell}>International</td>
          <td className={styles.cell}>200% of the cost of oneway ticket - no more than 675 USD</td>
          <td className={styles.cell}>200% of the cost of oneway ticket - no more than 675 USD</td>
          <td className={styles.cell}>400% of the cost of oneway ticket - no more than 1350 USD</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Item;
