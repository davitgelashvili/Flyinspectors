'use client'

import Item from "./Item.js";
import styles from "./CompensationEU.module.scss";
import BulletPoint from "./BulletPoint.js";
import { useEffect, useState } from "react";
import Tablefive from "../../../components/Tables/tablefive/Tablefive.js";

const CompensationEU = () => {
  const [table, setTable] = useState(true)
  const windowUrl = typeof window !== 'undefined' ? window.location.host : ''

  useEffect(()=>{
    if (windowUrl === 'flyinpectors.com' || windowUrl === 'flyinpectors.ge'){
      setTable(true)
    }else {
      setTable(true)
    }

  }, [])
  return (
    <div className={styles.services}>
      <div className={`container`}>
        <div className="row">
          <div className="col-lg-6 col-12">
            <BulletPoint />
          </div>
          <div className={`${styles.item} col-lg-6 col-12`}>
            {table && <Tablefive />}
            {!table && <Item />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompensationEU;
