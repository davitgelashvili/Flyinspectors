'use client'

import Item from "./Item.js";
import styles from "./CompensationUSA.module.scss";
import BulletPoint from "./BulletPoint.js";
import { useEffect, useState } from "react";
import TableThree from "../../../components/Tables/tablethree/tablethree.js";
import Tablefour from "../../../components/Tables/tablefour/Tablefour.js";

const CompensationUSA = () => {
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
      <div className={`container `}>
        <div className="row">
          <div className="col-lg-6 col-12">
            <BulletPoint />
          </div>
          <div className={`${styles.item} col-lg-6 col-12`}>
            {table && <Tablefour />}
            {!table && <Item />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompensationUSA;
