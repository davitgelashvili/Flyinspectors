'use client'

import Item from "./Item.js";
import styles from "./CompensationHowMuch.module.scss";
import BulletPoint from "./BulletPoint.js";
import Tabletwo from "../../../components/Tables/tabletwo/tabletwo.js";
import { useEffect, useState } from "react";

const CompensationHowMuch = () => {
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
      <div className= "container">
        <div className="row">
          <div className="col-lg-5 col-12">
            <BulletPoint />
          </div>
          <div className={`col-lg-7 col-12`}>
            {table && <Tabletwo/>}
            {!table && <Item/>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompensationHowMuch;
