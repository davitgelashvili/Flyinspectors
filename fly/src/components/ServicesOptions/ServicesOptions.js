import styles from "./ServicesOptions.module.scss";
import Item from "./Item";
import cover from '../../assetss/images/rb_63991.png'
import { getServices } from "@/api/serverApi";

const ServicesOptions = async ({ lang }) => {
  const data = await getServices();

  return (
    <div className={styles.mainContainer}>
      <img src={cover} alt="cover" className={styles.mainContainer__cover}/>
      <div className="container">
        <div className={styles.services}>
          <h3>
            <span>FLYINSPECTORS</span> HELPED MANY PASSENGERS
          </h3>
          <h3>WE CAN HELP YOU TOO</h3>
        </div>
        <div className="row">
          {data.map((item) => (
            <div className="col-lg-4" key={item.id}>
              <Item title={item.title} desc={item.description} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesOptions;
