import Item from "./Item.js";
import styles from "./RateSection.module.scss";

const RateSection = ({ lang }) => {
  return (
    <div>
      <div className={`${styles.services} `}>
        <div className="container">
          <div className="row">
            <Item lang={lang} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateSection;
