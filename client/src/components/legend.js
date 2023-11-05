import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./legend.module.css";

const Legend = ({ driverTreeObj }) => {
//the below function gets all of the stakeholders and abbreviations from the driverTreeObj, then removes any duplicates and places them in a list under the legend.
  function stake({ driverTreeObj }) {
    let stakes = [];
    return driverTreeObj.map((f, index) => {
      if (driverTreeObj[index].stakeholders != null) {
        let temp = {
          sholder: driverTreeObj[index].stakeholders,
          abbrev: driverTreeObj[index].stakeholderAbbreviation,
        };

        const duplicate = stakes.find((s) => s.sholder === temp.sholder);
        if (duplicate) {
        } else {
            stakes.push(temp);
            return (
              <Row>
                <Col>
                {driverTreeObj[index].stakeholders}{":     "}
                </Col>
                <Col>
                {driverTreeObj[index].stakeholderAbbreviation}
                </Col>
              </Row>
            );
        }
      }
    });
  }

  return (
    <div className="legend">
      <Col className={styles.legend_col}>
        <h4>Legend</h4>
        <h5>Stakeholders:</h5>
        {stake({ driverTreeObj })}
      </Col>
    </div>
  );
};
export default Legend;
