import styles from "./CompensationInfo.module.scss";

const Item = () => {
  return (
    <div className="">
      <div className={styles.mainDiv}>
        <h3 className={styles.header}>
        Flight Cancellation Compensation of up to 600 EUR
        </h3>
        <div className={styles.item}>
          <h4>Just like delays, flight cancellations happen. And it's not rare.</h4>
          <p>
          Flight cancellations can happen without prior notice, which can harm your travel plans.
          The European Union Act 261 in such cases allows up to 600 EUR compensation.
          </p>
          <br></br>
          <h4>Which airlines can you get compensation from.</h4>
          <p>
            According to EC 261 law, compensation coverage depends on the origin
            of the airline and the flight direction. For details see the chart
          </p>
        </div>
      </div>
    </div>
  );
};

export default Item;
