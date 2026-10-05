'use client'

import Item from "./Item.js";
import styles from "./TableJust.module.scss";
import image from "../../../components/Images/AirpLanePic.png"
import SectionCover from "../../../components/SectionTextAndCover/SectionCover.js";
import { useEffect, useState } from "react";
import Tablefour from "../../../components/Tables/tablefour/Tablefour.js";
import TableThree from "../../../components/Tables/tablethree/tablethree.js";

const TableJust = () => {
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
            <SectionCover image={image} />
          </div>
          <div className={`${styles.item} col-lg-6 col-12`}>
            {table && <TableThree />}
            {!table && <Item />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableJust;
