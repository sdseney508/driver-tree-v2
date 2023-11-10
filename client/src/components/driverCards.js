import React, { useRef, useEffect, useState } from "react";
// import Select from "react-select";
import { Col, Card, Row, Button, Form } from "react-bootstrap";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows"; //for the arrows
import { getArrows, deleteArrow } from "../utils/arrows";
import styles from "../pages/DriverTreePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import Legend from "../components/legend";
import { useNavigate } from "react-router";
import {
  createDriver,
  deleteDriver,
  getOutcome,
  updateCluster,
  updateDriver,
} from "../utils/drivers";
import DriverArrows from "./DrawArrows";

const DriverCards = ({
  arrowID,
  state,
  driverTreeObj,
  selOutcome,
  setSelOutcome,
  setArrowID,
  setArrowMod,
  showArrowMod,
}) => {
  //This module has four functions:
  //1.  It creates the divs that go into the driver tree columns
  //2.  It creates the individual cards in the correct divs
  //3.  It houses the drag and drop functionality for the cards.  this requires the use of the onDragOver, onDragStart, draggable, and onDrop properties in the divs and cards
  //4.  Draws the correct clusters around the selected drivers based on the cluster field in the drivers table
  //The arrow function is contained in the arrows.js module.  It creates the arrows that connect the cards

  //initially set the arrows empty then pull them from the database.  This is done so that the arrows can be updated when the user changes the outcome
  const [arrows, setArrows] = useState([]);
  let navigate = useNavigate();

  //adding in a useEffect feature to rerender on change to selOutcome
  useEffect(() => {
    const getData = async() => {
      await getArrows(selOutcome.id).then((data) => {
        setArrows(data.data);
      });
    }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  getData();
  }, [selOutcome]);

  function allowDrop(e) {
    //this property gets set on the individual divs onDragOver property to limit where a card can be dropped
    e.preventDefault();
  }

  function drag(e) {
    e.dataTransfer.setData("text", e.target.dataset.cardid);
  }

  async function drop(e) {
    //on drop, sets the drivers new Tier and subTier as required.  The driver is then updated in the database so it will be placed in its new place on the next render
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    e.target.appendChild(document.getElementById(data));
    let body = {
      tierLevel: e.target.dataset.tier,
      subTier: e.target.dataset.subtier,
    };
    await updateDriver(data, body);
    window.location.reload();
    setSelOutcome(selOutcome);
  }

  const delDriver = (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this driver?")) {
      return;
    }
    deleteDriver(e.target.dataset.delid);
    getOutcome(selOutcome.id).then((data) => {
      setSelOutcome(data.data);
    });
  };
  const goToDriver = async (e) => {
    e.preventDefault();
    navigate("/drpage/" + selOutcome.id + "/" + e.target.dataset.cardid);
  };

  const newDriver = async (e) => {
    e.preventDefault();
    let body = { outcomeID: selOutcome.id, tierLevel: e.target.dataset.tier };
    await createDriver(body);
    getOutcome(selOutcome.id).then((data) => {
      setSelOutcome(data.data);
    });
  };

  //navigate to the outcome page
  const goToOutcome = async (e) => {
    navigate("/allOutcomes/" + selOutcome.id);
  };

  const deleteCluster = (e) => {
    e.preventDefault();
    if(!e.target.dataset.cluster) {
      e.stopPropagation();
      return;
    }

    //check to see if there is an arrow attached to the cluster to cascade the delete
    let arrowid;
    for (let i=0; i<arrows.length; i++) {
      if (arrows[i].start === e.target.id || arrows[i].end === e.target.id) {
        arrowid = arrows[i].id;
      }};


    console.log(e.target.dataset.cluster);
    let sures = window.confirm("Are you sure you want to delete this cluster?  This will also delete any arrows assigned to this cluster.");
    if (!sures) {
      return;
    }
    let body = { cluster: 0 };
    updateCluster(e.target.dataset.cluster, body);
    deleteArrow(arrowid);
    window.location.reload();
  };

  function tierButtons(tier) {
    if (state.Role !== "Stakeholder") {
      return (
        <Button className={styles.my_btn} onClick={newDriver} data-tier={tier}>
          +
        </Button>
      );
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let body = { [e.target.name]: e.target.value };
    console.log("body: ", body);
    updateDriver(e.target.dataset.cardid, body);
  };

  function tierCards(tier, { driverTreeObj }) {
    const arr = [];
    let clusterNumber;
    if (!driverTreeObj) {
      return <div></div>;
    } else {
      for (let i = 0; i < 36; i++) {
        //needs a nested loop for those instances when the driverTreeObj is smaller than 15
        // logic as follows:  insert a placeholder row, then check to see if there should be a card or a cluster, if yes, pop that row and insert card
        arr.push("skip");
        for (let j = 0; j < driverTreeObj.length; j++) {
          let t = i + 1; //the subtiers for the users start at 1 not 0
          if (
            driverTreeObj[j].tierLevel === tier &&
            driverTreeObj[j].subTier === t
          ) {
            arr[i] = driverTreeObj[j];
          }
        }
      }

      return arr.map((f, index) => {
        if (arr[index] === "skip") {
          return (
            <Xwrapper>
              <div
                className={styles.my_div}
                data-tier={tier}
                data-subtier={index + 1}
                id={"tier1subTier" + (index + 1)}
                onDragOver={allowDrop}
                onDrop={drop}
              ></div>
            </Xwrapper>
          );
        } else if (
          arr[index].cluster > 0 &&
          arr[index].cluster !== clusterNumber
        ) {
          //check to see how large the cluster is, then create a div for each card in the cluster
          //create a new array for each driver in the cluster then map the array to create the cards
          clusterNumber = arr[index].cluster;
          let clusterArr = [];
          for (let j = index; j < arr.length; j++) {
            if (arr[j].cluster === clusterNumber) {
              clusterArr.push(arr[j]);
              index++;
            } else {
              j = arr.length;
              index++;
            }
          }

          return (
            <div
              className={styles.my_cluster}
              data-tier={tier}
              data-subtier={index + 1}
              data-cluster={clusterNumber}
              id={`tier${tier}cluster` + clusterNumber} //this is used for the arrow start and end points
              onClick={deleteCluster}
            >
              {clusterArr.map((f, ind) => {
                let dColor;
                switch (clusterArr[ind].status) {
                  case "Green":
                    dColor = "#00ff00";
                    break;
                  case "Yellow":
                    dColor = "#ffff00";
                    break;
                  case "Red":
                    dColor = "#ff0000";
                    break;
                  default:
                }
                return (
                  <Card
                  className={styles.my_card}
                  id={"card" + clusterArr[ind].id}
                  data-cardid={clusterArr[ind].id}
                  data-delid={clusterArr[ind].id}
                  draggable="true"
                  onDragStart={drag}
                >
                  <FontAwesomeIcon
                    position="top"
                    icon={faCircle}
                    style={{ color: dColor }}
                    data-cardid={clusterArr[ind].id}
                    className={styles.card_status}
                  />
                  <Card.Body className={styles.my_card_body}>
                    <Row className={styles.card_row}>
                      <Col className={styles.card_col_abbrev}>
                        <div
                          className={styles.abbreviation_div}
                          onClick={goToDriver}
                          data-cardid={clusterArr[ind].id}
                        >
                          {clusterArr[ind].stakeholderAbbreviation
                            ? clusterArr[ind].stakeholderAbbreviation
                            : "-"}
                        </div>
                        <div
                          onClick={delDriver}
                          data-delid={clusterArr[ind].id}
                          className={styles.del_div}
                        >
                          Del
                        </div>
                      </Col>
                      <Col className={styles.card_col_body} id={clusterArr[ind].id}>
                        <Form>
                          <Form.Control
                            as="textarea"
                            data-cardid={clusterArr[ind].id}
                            className={styles.my_card_text}
                            defaultValue={clusterArr[ind].problemStatement}
                            //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                            name="problemStatement"
                            // onChange={handleInputChange}
                            onBlur={handleFormSubmit}
                          />
                        </Form>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                );
              })}
            </div>
          );
        } else if (arr[index].cluster !== clusterNumber) {
          let dColor;
          switch (arr[index].status) {
            case "Green":
              dColor = "#00ff00";
              break;
            case "Yellow":
              dColor = "#ffff00";
              break;
            case "Red":
              dColor = "#ff0000";
              break;
            default:
          }
          return (
            <div
              className={styles.my_div}
              data-tier={tier}
              data-subtier={index + 1}
              id={"tier1subTier" + (index + 1)}
              onDragOver={allowDrop}
              onDrop={drop}
            >
              <Card
                className={styles.my_card}
                id={"card" + arr[index].id}
                data-cardid={arr[index].id}
                data-delid={arr[index].id}
                draggable="true"
                onDragStart={drag}
              >
                <FontAwesomeIcon
                  position="top"
                  icon={faCircle}
                  style={{ color: dColor }}
                  data-cardid={arr[index].id}
                  className={styles.card_status}
                />
                <Card.Body className={styles.my_card_body}>
                  <Row className={styles.card_row}>
                    <Col className={styles.card_col_abbrev}>
                      <div
                        className={styles.abbreviation_div}
                        onClick={goToDriver}
                        data-cardid={arr[index].id}
                      >
                        {arr[index].stakeholderAbbreviation
                          ? arr[index].stakeholderAbbreviation
                          : "-"}
                      </div>
                      <div
                        onClick={delDriver}
                        data-delid={arr[index].id}
                        className={styles.del_div}
                      >
                        Del
                      </div>
                    </Col>
                    <Col className={styles.card_col_body} id={arr[index].id}>
                      <Form>
                        <Form.Control
                          as="textarea"
                          data-cardid={arr[index].id}
                          className={styles.my_card_text}
                          defaultValue={arr[index].problemStatement}
                          //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                          name="problemStatement"
                          // onChange={handleInputChange}
                          onBlur={handleFormSubmit}
                        />
                      </Form>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          );
        }
      });
    }
  }

  async function ArrowModal(e, arrowID) {
    e.preventDefault();
    await setArrowID(arrowID);
    setArrowMod(true);
  }

  return (
    <>
      <div id="outcomeColumn" className={styles.top_div}>
        <Xwrapper>
          <Col className={styles.driver} sm={6} md={6} lg={2} key="0">
            <p>Tier 0</p>
            <Row
              style={{
                height: "800px",
                width: "100%",
              }}
              className="m-1"
              id="outcomeColumn"
              key="outcomeColumn1"
            >
              <Card
                className={styles.my_card}
                onClick={goToOutcome}
                id={`outcomeID${selOutcome.id}`}
              >
                <Card.Body className={styles.my_card_body}>
                  <Card.Text className={styles.my_card_text}>
                    {selOutcome.outcomeTitle}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Row style={{ height: "700px" }}>
                <Legend driverTreeObj={driverTreeObj} />
              </Row>
            </Row>
          </Col>
          <Col className={styles.driver} sm={6} md={6} lg={2} key="1">
            <p>{`Tier 1 Drivers`}</p>
            <Row
              style={{
                height: "1400px",
                width: "100%",
              }}
              id={`tier1Cards`}
              key={`tier1Cards`}
              className={styles.my_row}
            >
              {tierCards(1, { driverTreeObj })}
            </Row>
            <Row style={{ height: "50px" }}>{tierButtons(1)}</Row>
          </Col>
          <Col className={styles.driver} sm={6} md={6} lg={2} key="2">
            <p>{`Tier 2 Drivers`}</p>
            <Row
              style={{
                height: "1400px",
                width: "100%",
              }}
              id={`tier2Cards`}
              key={`tier2Cards`}
              className={styles.my_row}
            >
              {tierCards(2, { driverTreeObj })}
            </Row>
            <Row style={{ height: "50px" }}>{tierButtons(2)}</Row>
          </Col>
          <Col className={styles.driver} sm={6} md={6} lg={2} key="3">
            <p>{`Tier 3 Drivers`}</p>
            <Row
              style={{
                height: "1400px",
                width: "100%",
              }}
              id={`tier3Cards`}
              key={`tier3Cards`}
              className={styles.my_row}
            >
              {tierCards(3, { driverTreeObj })}
            </Row>
            <Row style={{ height: "50px" }}>{tierButtons(3)}</Row>
          </Col>
          <Col className={styles.driver} sm={6} md={6} lg={2} key="4">
            <p>{`Tier 4 Drivers`}</p>
            <Row
              style={{
                height: "1400px",
                width: "100%",
              }}
              id={`tier4Cards`}
              key={`tier4Cards`}
              className={styles.my_row}
            >
              {tierCards(4, { driverTreeObj })}
            </Row>
            <Row style={{ height: "50px" }}>{tierButtons(4)}</Row>
          </Col>
          <Col className={styles.driver} sm={6} md={6} lg={2} key="5">
            <p>{`Tier 5 Drivers`}</p>
            <Row
              style={{
                height: "1400px",
                width: "100%",
              }}
              id={`tier5Cards`}
              key={`tier5Cards`}
              className={styles.my_row}
            >
              {tierCards(5, { driverTreeObj })}
            </Row>
            <Row style={{ height: "50px" }}>{tierButtons(5)}</Row>
          </Col>
          {arrows ? (
            <DriverArrows arrows={arrows} ArrowModal={ArrowModal} />
          ) : (
            null
          )}
        </Xwrapper>
      </div>
    </>
  );
};

export default DriverCards;
