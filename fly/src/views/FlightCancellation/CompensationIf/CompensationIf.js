'use client'

import Item from "./Item.js";
import styles from "./CompensationIf.module.scss";
import BulletPoint from "./BulletPoint.js";
import { useEffect, useState } from "react";
import TableOne from "../../../components/Tables/tableone/tableone.js";

const CompensationIf = () => {
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
          <div className="col-lg-5 col-12">
            <BulletPoint />
          </div>
          <div className={`col-lg-7 col-12`}>
            {table && <TableOne />}
            {!table && <Item />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompensationIf;
