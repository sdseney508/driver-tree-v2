import React, { useEffect, useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import styles from "./legend.module.css";
import { getStatusDefinitionByOutcome } from "../utils/statusDefinition";
import { modifyStatusDefinition } from "../utils/statusDefinition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const Legend = ({ driverTreeObj, selOutcome, recordLockState }) => {
  //the below function gets all of the stakeholders and abbreviations from the driverTreeObj, then removes any duplicates and places them in a list under the legend
  const [statusDefinition, setStatusDefinition] = useState([]);
  useEffect(() => {
    const getInfo = async () => {
      let outcomeId = selOutcome.id;
      await getStatusDefinitionByOutcome(outcomeId).then((res) => {
        setStatusDefinition(res.data);
      });
    };
    getInfo();
  }, [selOutcome]);

  const handleInputChange = (e) => {
    if (recordLockState) {
      return;
    }
    let body = { [e.target.name]: e.target.value };
    // setOutcome({ ...outcome, [name]: value });
    modifyStatusDefinition(e.target.id, body);
  };

  function colorByStatus(statusId) {
    const backGroundColor = {
      1: "green",
      2: "yellow",
      3: "red",
    };
    return backGroundColor[statusId];
  }

  const statusDef = () => {
    if (statusDefinition.length < 1) {
      return;
    }
    statusDefinition.sort((a, b) => a.statusId - b.statusId);
    return statusDefinition.map((f, ind) => {
      let statColor = colorByStatus(f.statusId);
      return (
        <div key={"statusDefDiv"+f.id}>
          <Row key={"statusDefRow" + f.id} style={{display: 'flex', flexDirection: "row", width: "160px"}}>
            <div style={{ width: "15px"}} key={"div"+f.id}>
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: statColor }}
              ></FontAwesomeIcon>
            </div>
            <div  style={{ width: "135px" }}>
              <Form>
                <Form.Control
                  as="textarea"
                  name="statusDefinition"
                  id={f.id}
                  defaultValue={f.statusDefinition}
                  onChange={handleInputChange}
                  style={{fontSize: "10px"}}
                />
              </Form>
            </div>
          </Row>
        </div>
      );
    });
  };

  const stake = (driverTreeObj) => {
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
          <div key={'stake'+ index}>
            <Row key={"stakeRow" + index}>
              <Col key={"Sholder" + index}>
                {driverTreeObj[index].stakeholders}
                {"     "}
              </Col>
              <Col key={"SholderAbbrev" + index}>
                {driverTreeObj[index].stakeholderAbbreviation}
              </Col>
            </Row>
          </div>
        );
      }
    });
  };

  return (
    <>
      <div className={styles.legend} key={"legend.div"}>
        <Col className={styles.legend_col} key={'legend.col'}>
          <h4>Legend</h4>
          <h5>Stakeholders:</h5>
          {stake(driverTreeObj)}
          <br />
          <br />
          <h5>Status Definitions</h5>
          {statusDefinition ? statusDef(statusDefinition) : null}
        </Col>
      </div>
    </>
  );
};
export default Legend;
