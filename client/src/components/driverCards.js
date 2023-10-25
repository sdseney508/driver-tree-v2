import React, { useEffect, useState } from "react";
// import Select from "react-select";
import { Col, Card, Row, Button } from "react-bootstrap";
import styles from "../pages/DriverTreePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router";
import { deleteDriver, getOutcome, updateDriver } from "../utils/drivers";

const DriverCards = ({ tier, driverTreeObj, selOutcome, setSelOutcome, newDriver }) => {
  //This module has three functions:
  //1.  It creates the divs that go into the driver tree columns
  //2.  It creates the individual cards in the correct divs
  //3.  It houses the drag and drop functionality for the cards.  this requires the use of the onDragOver, onDragStart, draggable, and onDrop properties in the divs and cards
  //The arrow function is contained in the arrows.js module.  It creates the arrows that connect the cards

  console.log("driverTreeObj", driverTreeObj);
  let location = useLocation();
  let navigate = useNavigate();

  //very simple drag and drop functionality.  The card is assigned an id in the database, and that id is passed to the drop function
  function allowDrop(e) {
    //this property gets set on the individual divs onDragOver property to limit where a card can be dropped
    e.preventDefault();
  }

  function drag(e) {
    console.log(e.target);
    e.dataTransfer.setData("text", e.target.id);
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
  }

  const delDriver = (e) => {
    e.preventDefault();
    console.log(e.target.id);
    deleteDriver(e.target.id);
    getOutcome(selOutcome.id).then((data) => {
      setSelOutcome(data.data);
    });
    window.location.reload(false);
  };

  const goToDriver = async (e) => {
    navigate("/drpage", {
      state: { selDriver: e.target.id, selOutcome: selOutcome.id },
    });
  };

  function tierCards({ tier }, { driverTreeObj }) {
    const arr = [];
    if (!driverTreeObj) {
      return <div>nuts and</div>;
    } else {
      // for (let i = 0; i < 10; i++) {
      //   let t = i+1; //the subtiers for the users start at 1 not 0
      for (let i = 0; i < 10; i++) {
        //needs a nested loop for those instances when the driverTreeObj is smaller than 10
        // logic as follows:  insert a placeholder row, then check to see if there should be a card, if yes, pop that row and insert card
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
        } else {
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
                id={arr[index].id}
                draggable="true"
                onDragStart={drag}
              >
                <Card.Header className={styles.card_header}>
                  <FontAwesomeIcon
                    position="top"
                    icon={faSquare}
                  ></FontAwesomeIcon>
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
        <p>Tier 1 Drivers</p>
        <Row
          style={{
            height: "700px",
            width: "100%",
          }}
          className="m-1"
        >
          {tierCards(tier, { driverTreeObj })}
        </Row>
        <Row style={{ height: "50px" }}>
          <Button className={styles.my_btn} onClick={newDriver} data-tier="1">
            +
          </Button>
        </Row>
      </Col>
    </>
  );
};

export default DriverCards;
