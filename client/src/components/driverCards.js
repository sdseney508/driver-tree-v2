import React, { useEffect, useState } from "react";
// import Select from "react-select";
import { Col, Card } from "react-bootstrap";
import styles from "../pages/DriverTreePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router";
import {
  createDriver,
  createOutcome,
  getOutcome,
  getDrivers,
  getDriverByOutcome,
  updateDriver,
} from "../utils/drivers";

const DriverCards = ({ selOutcome, driverTreeObj, setDriverTreeObj }) => {
  console.log("driverTreeObj is: ", driverTreeObj);
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

  function drag(e) {
    console.log(e.target);
    e.dataTransfer.setData("text", e.target.id);
  }

  function drop(e) {
    //on drop, sets the drivers new Tier and subTier as required.  The driver is then updated in the database so it will be placed in its new place on the next render
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    e.target.appendChild(document.getElementById(data));
  }

  const driverCards = (driver) => {
    //this function creates the individual cards that go into the divs it is called from

    let dColor;
    switch (driver.status) {
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
      <Card className={styles.my_card} onClick={goToDriver}>
        <Col>
          <FontAwesomeIcon
            position="top"
            icon={faCircle}
            style={{ color: dColor }}
            className={styles.card_status}
          />
        </Col>
        <Card.Body
          draggable="true"
          onDragStart={drag}
          className={styles.my_card_body}
          id={driver.id}
        >
          {driver.problemStatement}
        </Card.Body>
      </Card>
    );
  };

  const goToDriver = async (e) => {
    navigate("/drpage", {
      state: { selDriver: e.target.id, selOutcome: selOutcome.id },
    });
  };

  const tierOneCards = async () => {
    console.log("data is: ", driverTreeObj);
    // setDriverTreeObj(data.data);
    for (let i = 0; i < 10; i++) {
      let t = i + 1;
      if (!driverTreeObj) {
        return <div>hi</div>;
      }
      if (driverTreeObj[i].tier !== t) {
        return (
          <div
            className={styles.my_div}
            id={"tier1subTier" + driverTreeObj[i].subTier}
            onDragOver={allowDrop}
            onDrop={drop}
            styles={{ border: "1px solid black" }}
          ></div>
        );
      } else {
        return (
          <div
            className={styles.my_div}
            tier="1"
            subTier={t}
            id={"tier1subTier" + driverTreeObj[i].subTier}
            onDragOver={allowDrop}
            onDrop={drop}
            styles={{ border: "1px solid black", disaply: "flex" }}
          >
            {driverCards(driverTreeObj[i])}
          </div>
        );
      }
    }
  };

    //creates the divs that go into the tier one driver tree column,
    //then creates the cards that go into the divs
    //driverTreeObj is the object that contains the drivers that will be rendered
    //goToDriver is the function that will be called when a card is clicked
    //updateDriver is the function that will be called when a card is dropped into a div to update the driver's tier and subTier

  const tierTwoCards = (driverTreeObj, goToDriver) => {
    if (!driverTreeObj[0]) {
      return <div></div>;
    } else {
      return driverTreeObj[1].map((f, index) => {
        let dColor;
        switch (driverTreeObj[1][index].status) {
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
          <Card className={styles.my_card} onClick={goToDriver}>
            <Col>
              <FontAwesomeIcon
                position="top"
                icon={faCircle}
                style={{ color: dColor }}
                className={styles.card_status}
              />
            </Col>
            <Card.Body
              className={styles.my_card_body}
              id={driverTreeObj[1][index].id}
            >
              {driverTreeObj[1][index].problemStatement}
            </Card.Body>
          </Card>
        );
      });
    }
  };

  const tierThreeCards = (driverTreeObj, goToDriver) => {
    if (!driverTreeObj[2]) {
      return <div></div>;
    } else {
      return driverTreeObj[2].map((f, index) => {
        let dColor;
        switch (driverTreeObj[2][index].status) {
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
          <Card className={styles.my_card} onClick={goToDriver}>
            <Col>
              <FontAwesomeIcon
                position="top"
                icon={faCircle}
                style={{ color: dColor }}
                className={styles.card_status}
              />
            </Col>
            <Card.Body
              className={styles.my_card_body}
              id={driverTreeObj[2][index].id}
            >
              {driverTreeObj[2][index].problemStatement}
            </Card.Body>
          </Card>
        );
      });
    }
  };

  const tierFourCards = (driverTreeObj, goToDriver) => {
    if (!driverTreeObj[3]) {
      return <div></div>;
    } else {
      return driverTreeObj[3].map((f, index) => {
        let dColor;
        switch (driverTreeObj[3][index].status) {
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
          <Card className={styles.my_card} onClick={goToDriver}>
            <Col>
              <FontAwesomeIcon
                position="top"
                icon={faCircle}
                style={{ color: dColor }}
                className={styles.card_status}
              />
            </Col>
            <Card.Body
              className={styles.my_card_body}
              id={driverTreeObj[3][index].id}
            >
              {driverTreeObj[3][index].problemStatement}
            </Card.Body>
          </Card>
        );
      });
    }
  };

  const tierFiveCards = (driverTreeObj, goToDriver) => {
    if (!driverTreeObj[4]) {
      return <div></div>;
    } else {
      return driverTreeObj[4].map((f, index) => {
        let dColor;
        switch (driverTreeObj[4][index].status) {
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
          <Card className={styles.my_card} onClick={goToDriver}>
            <Col>
              <FontAwesomeIcon
                position="top"
                icon={faCircle}
                style={{ color: dColor }}
                className={styles.card_status}
              />
            </Col>
            <Card.Body
              className={styles.my_card_body}
              id={driverTreeObj[4][index].id}
            >
              {driverTreeObj[4][index].problemStatement}
            </Card.Body>
          </Card>
        );
      });
    }
  };

  return <div>{driverTreeObj ? tierOneCards() : "Hi"}</div>;
};

export default DriverCards;
