import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./legend.module.css";
import { getDriverByOutcome } from "../utils/drivers";

const Legend = ({ selOutcome }) => {
  //the below function gets all of the stakeholders and abbreviations from the driverTreeObj, then removes any duplicates and places them in a list under the legend.
  // debugger;
  const [driverTreeObj, setDriverTreeObj] = useState([]);

useEffect(() => {
      getDriverByOutcome(selOutcome.id).then((data) => {
        setDriverTreeObj(data.data);
      });
    }, [selOutcome]);


      const stake =(driverTreeObj) => {
    let stakes = [];
    if (driverTreeObj.length < 1) {
      return;
    }
    // eslint-disable-next-line array-callback-return
    return driverTreeObj.map((f, index) => {
      let temp = {
        sholder: driverTreeObj[index].stakeholders,
        abbrev: driverTreeObj[index].stakeholderAbbreviation,
      };

      const duplicate = stakes.find((s) => s.sholder === temp.sholder);
      if (duplicate) {
      } else {
        stakes.push(temp);
        return (
          <Row key={"stakeRow"+index}>
            <Col key={"Sholder"+index}>
              {driverTreeObj[index].stakeholders}
              {"     "}
            </Col>
            <Col key={"SholderAbbrev"+index}>{driverTreeObj[index].stakeholderAbbreviation}</Col>
          </Row>
        );
      }
    });
  }

  return (
    <div className={styles.legend}>
      <Col className={styles.legend_col}>
        <h4>Legend</h4>
        <h5>Stakeholders:</h5>
        {stake(driverTreeObj)}
      </Col>
    </div>
  );
};
export default Legend;
