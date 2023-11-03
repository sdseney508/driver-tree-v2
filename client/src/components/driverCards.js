import React, { useEffect, useState } from "react";
// import Select from "react-select";
import { Col, Card, Row, Button } from "react-bootstrap";
import styles from "../pages/DriverTreePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router";
import {
  createDriver,
  deleteDriver,
  getOutcome,
  updateCluster,
  updateDriver,
} from "../utils/drivers";

const DriverCards = ({ tier, driverTreeObj, selOutcome, setSelOutcome }) => {
  //This module has three functions:
  //1.  It creates the divs that go into the driver tree columns
  //2.  It creates the individual cards in the correct divs
  //3.  It houses the drag and drop functionality for the cards.  this requires the use of the onDragOver, onDragStart, draggable, and onDrop properties in the divs and cards
  //The arrow function is contained in the arrows.js module.  It creates the arrows that connect the cards

  let location = useLocation();
  let navigate = useNavigate();

  //very simple drag and drop functionality.  The card is assigned an id in the database, and that id is passed to the drop function
  function allowDrop(e) {
    //this property gets set on the individual divs onDragOver property to limit where a card can be dropped
    e.preventDefault();
  }

  function createCluster(e) {
    //this function creates the cluster divs that go into the driver tree columns
    e.preventDefault();

    let body = { outcomeID: selOutcome.id, tierLevel: e.target.dataset.tier };
    updateDriver(e.target.dataset.cardid, body);
  }

  function drag(e) {
    e.dataTransfer.setData("text", e.target.dataset.cardid);
  }

  function drop(e) {
    //on drop, sets the drivers new Tier and subTier as required.  The driver is then updated in the database so it will be placed in its new place on the next render
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    e.target.appendChild(document.getElementById(data));
    let body = {
      tierLevel: e.target.dataset.tier,
      subTier: e.target.dataset.subtier,
    };
    updateDriver(data, body);
    window.location.reload(false);
  }

  const delDriver = (e) => {
    e.preventDefault();
    deleteDriver(e.target.id);
    getOutcome(selOutcome.id).then((data) => {
      setSelOutcome(data.data);
    });
    window.location.reload(false);
  };

  const goToDriver = async (e) => {
    navigate("/drpage/" + selOutcome.id + "/" + e.target.id);
  };

  const newDriver = (e) => {
    e.preventDefault();
    let body = { outcomeID: selOutcome.id, tierLevel: e.target.dataset.tier };
    createDriver(body);
    getOutcome(selOutcome.id).then((data) => {
      setSelOutcome(data.data);
    });
    window.location.reload(false);
  };

  const deleteCluster = (e) => {
    e.preventDefault();
    let sures = window.confirm("Are you sure you want to delete this cluster?");
    if (!sures) {return}
    let body = { cluster: 0 };
    updateCluster(e.target.dataset.cluster, body);
    window.location.reload(false);
  };

  function tierButtons(tier) {
    return (
      <Button className={styles.my_btn} onClick={newDriver} data-tier={tier}>
        +
      </Button>
    );
  }

  function tierCards(tier, { driverTreeObj }) {
    const arr = [];
    let clusterNumber;
    if (!driverTreeObj) {
      return <div></div>;
    } else {
      for (let i = 0; i < 15; i++) {
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
            <div
              className={styles.my_div}
              data-tier={tier}
              data-subtier={index + 1}
              id={"tier1subTier" + (index + 1)}
              onDragOver={allowDrop}
              onDrop={drop}
            ></div>
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
              data-clusterid={`tier${tier}cluster`+ index+1}
              data-cluster={clusterNumber}
              id={`tier${tier}subTier` + (index + 1)} //need to fix this
              onDragOver={allowDrop}
              onDrop={drop}
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
                    draggable="true"
                    onDragStart={drag}
                  >
                    <Card.Header className={styles.card_header}>
                      <div className={styles.my_card_abb}>
                        {clusterArr[ind].stakeholderAbbreviation
                          ? clusterArr[ind].stakeholderAbbreviation
                          : "-"}
                      </div>
                      <FontAwesomeIcon
                        position="top"
                        icon={faCircle}
                        style={{ color: dColor }}
                        className={styles.card_status}
                      />
                    </Card.Header>

                    <Card.Body
                      className={styles.my_card_body}
                      id={clusterArr[ind].id}
                    >
                      <Card.Text
                        className={styles.my_card_text}
                        id={clusterArr[ind].id}
                        onClick={goToDriver}
                      >
                        {clusterArr[ind].problemStatement}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer
                      className={styles.card_footer}
                      onClick={delDriver}
                      id={clusterArr[ind].id}
                    >
                      Delete
                    </Card.Footer>
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
                draggable="true"
                onDragStart={drag}
              >
                <Card.Header className={styles.card_header}>
                  <div className={styles.my_card_abb}>
                    {arr[index].stakeholderAbbreviation
                      ? arr[index].stakeholderAbbreviation
                      : "-"}
                  </div>
                  <FontAwesomeIcon
                    position="top"
                    icon={faCircle}
                    style={{ color: dColor }}
                    className={styles.card_status}
                  />
                </Card.Header>

                <Card.Body className={styles.my_card_body} id={arr[index].id}>
                  <Card.Text
                    className={styles.my_card_text}
                    id={arr[index].id}
                    onClick={goToDriver}
                  >
                    {arr[index].problemStatement}
                  </Card.Text>
                </Card.Body>
                <Card.Footer
                  className={styles.card_footer}
                  onClick={delDriver}
                  id={arr[index].id}
                >
                  Delete
                </Card.Footer>
              </Card>
            </div>
          );
        }
      });
    }
  }

  return (
    <>
      <Col className={styles.driver} key="1">
        <p>{`Tier ${tier.tier} Drivers`}</p>
        <Row
          style={{
            height: "750px",
            width: "100%",
          }}
          id={`tier${tier.tier}Cards`}
          key={`tier${tier.tier}Cards`}
          className={styles.my_row}
        >
          {tierCards(tier.tier, { driverTreeObj })}
        </Row>
        <Row style={{ height: "50px" }}>{tierButtons(tier.tier)}</Row>
      </Col>
    </>
  );
};

export default DriverCards;
