'use client'

import Item from "./Item.js";
import styles from "./BeAware.module.scss";
import MenuItem from "./MenuItem.js";
import { useTranslation } from "react-i18next";

const KnowsYourRights = () => {
  const {t} = useTranslation()
  return (
    <div>
      <div className={`${styles.services} container`}>
        <h3
          className={`${styles.services__header} d-flex justify-content-center pb-5`}
        >
          {t('KnowsYourRights.title')}
        </h3>
        <div className="row">
          <div className="col-lg-5">
      <div style={{marginBottom:"50px"}}>
      <Item />
      </div>
          </div>
          <div className={`col-lg-7 col-12`}>
            <MenuItem />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowsYourRights;
