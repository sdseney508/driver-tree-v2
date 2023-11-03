import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./legend.module.css";

const Legend = ({ driverTreeObj }) => {

  function stake({ driverTreeObj }) {
    // debugger;
    let stakes = [];
    return driverTreeObj.map((f, index) => {
      if (driverTreeObj[index].stakeholders != null) {
        let temp = {
          sholder: driverTreeObj[index].stakeholders,
          abbrev: driverTreeObj[index].stakeholderAbbreviation,
        };
        console.log(temp.sholder);
        const duplicate = stakes.find((s) => s.sholder === temp.sholder);
        console.log(duplicate);
        if (duplicate) {
            console.log("i am here");
        } else {
            stakes.push(temp);
            console.log(stakes);
            console.log(index);
            console.log("i am over there");
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
