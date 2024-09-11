import React, { useEffect, useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import styles from "./legend.module.css";
import { getStatusDefinitionByOutcome } from "../utils/statusDefinition";
import { modifyStatusDefinition } from "../utils/statusDefinition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateDriver } from "../utils/drivers";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const Legend = ({ driverTreeObj, selOutcome, recordLockState, state, PDFState }) => {
  //the below function gets all of the stakeholders and abbreviations from the driverTreeObj, then removes any duplicates and places them in a list under the legend
  const [statusDefinition, setStatusDefinition] = useState([]);

  //flatten the driverTreeObj for the map function, also allows it to be searched for duplicates
  let flatDriverTreeObj = driverTreeObj.flat();

  useEffect(() => {
    const getInfo = async () => {
      let outcomeId = selOutcome.id;
      await getStatusDefinitionByOutcome(outcomeId).then((res) => {
        setStatusDefinition(res.data);
      });
    };
    getInfo();
  }, [selOutcome]);
  //updating the color codes definitions at the bottom of the page
  const handleInputChange = (e) => {
    if (recordLockState) {
      return;
    }
    let body = { [e.target.name]: e.target.value };
    modifyStatusDefinition(e.target.id, body);
  };

  function colorByStatus(statusId) {
    const backGroundColor = {
      1: "green",
      2: "yellow",
      3: "red",
      4: "blue"
    };
    return backGroundColor[statusId];
  }

  //updating the Stakeholders Table and the associated drivers.  Here we cycle throught the flatDriverTreeObj and update the stakeholders in the driver model
  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let i = 0; i < flatDriverTreeObj.length; i++) {
      if (
        flatDriverTreeObj[i] !== null && flatDriverTreeObj[i].stakeholderAbbreviation === e.target.dataset.abbr
      ) {
        let body = { [e.target.name]: e.target.value };
        await updateDriver(flatDriverTreeObj[i].driverId, state.userId, body);
      }
    }
  };

  const statusDef = () => {
    if (statusDefinition.length < 1) {
      return;
    }
    statusDefinition.sort((a, b) => a.statusId - b.statusId);
    return statusDefinition.map((f, ind) => {
      let statColor = colorByStatus(f.statusId);
      return (
        <div key={"statusDefDiv" + f.id}>
          <Row
            key={"statusDefRow" + f.id}
            style={{ display: "flex", flexDirection: "row", width: "190px" }}
          >
            <div style={{ width: "15px" }} key={"div" + f.id}>
              <FontAwesomeIcon
                icon={faCircle}
                style={{ color: statColor }}
              ></FontAwesomeIcon>
            </div>
            <div style={{ width: "155px" }}>
              {!PDFState ? <Form>
                <Form.Control
                  as="textarea"
                  name="statusDefinition"
                  id={f.id}
                  defaultValue={f.statusDefinition}
                  onChange={handleInputChange}
                  style={{ fontSize: "9px", padding: "0px" }}
                />
              </Form>: f.statusDefinition}
            </div>
          </Row>
        </div>
      );
    });
  };

  const stake = (driverTreeObj, PDFState) => {
    let stakes = [];
    if (!driverTreeObj || driverTreeObj.length < 1) {
      return;
    }

    //first we flatten the array of objects to an array of strings.  This allows the map to work correctly
    const flatDriverTreeObj = driverTreeObj.flat();
    // eslint-disable-next-line array-callback-return
    return flatDriverTreeObj.map((f, index) => {
      let temp = {};
      if (flatDriverTreeObj[index] !== null) {
        temp = {
          sholder: flatDriverTreeObj[index].stakeholders,
          abbrev: flatDriverTreeObj[index].stakeholderAbbreviation,
        };
      }
      const duplicate = stakes.find((s) => s.abbrev === temp.abbrev);
      if (duplicate || flatDriverTreeObj[index] === null) {
      } else {
        stakes.push(temp);
        return (
          <div key={"stake" + index}>
            <Row key={"stakeRow" + index} className={styles.legend_row}>
              <Col key={"Sholder-legend" + index}>
                {!PDFState ? <Form>
                  <Form.Control
                    as="input"
                    name="stakeholders"
                    data-legendid={flatDriverTreeObj[index].driverId}
                    defaultValue={flatDriverTreeObj[index].stakeholders || ""}
                    data-abbr={flatDriverTreeObj[index].stakeholderAbbreviation}
                    onBlur={handleSubmit}
                    disabled={recordLockState}
                    className={styles.legend_input}
                  ></Form.Control>
                </Form>: flatDriverTreeObj[index].stakeholders}
              </Col>
              <Col
                key={"S-Abbrev" + index}
                style={{ width: "45px" }}
                className={styles.legend_input}
              >
                {flatDriverTreeObj[index].stakeholderAbbreviation}
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
        <Col className={styles.legend_col} key={"legend.col"}>
          <h5>Legend</h5>
          <div style={{ fontSize: "12px" }}>Stakeholders:</div>
          {stake(driverTreeObj, PDFState)}
          <br />
          <br />
          <div style={{ fontSize: "12px" }}>Status Definitions</div>
          {statusDefinition ? statusDef(statusDefinition, PDFState) : null}
        </Col>
      </div>
    </>
  );
};
export default Legend;
