import styles from "./RateSection.module.scss";
import { getRates } from "@/api/serverApi";

const Item = async ({ lang }) => {
  const data = await getRates();

  return (
      <div className={`row ${styles.rowContainer} `}>
        {data.map((item) => (
          <div className="col-lg-4" key={item.id}>
            <div className="card mb-3">
              <div className="row g-0 align-items-center">
                <div className="col-md-4">
                  <img
                    src={item.icon}
                    className={styles.image}
                    alt="Card Image"
                  />
                </div>
                <div className="col-md-8 d-flex align-items-center">
                  <div className="card-body ms-3">
                    <h4 className={`card-title ${styles.cardNumber}`}>{item.title?.[lang]}</h4>
                    <div className={`card-title ${styles.description}`}>
                      {item.description?.[lang]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
  );
};

export default Item;
