//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
// import Select from "react-select";
import { stateContext } from "../App";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  createDriver,
  createOutcome,
  deleteDriver,
  getOutcome,
  getDrivers,
  getDriverByOutcome,
  updateDriver,
} from "../utils/drivers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faTrash, faSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router";
import Legend from "../components/legend";
import { getUser, loggedIn, getToken } from "../utils/auth";

import styles from "./DriverTreePage.module.css";
import OutcomeTable from "../components/OutcomeTable";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const DriverTreePage = () => {
  const [state, setState] = useContext(stateContext);
  const [selOutcome, setSelOutcome] = useState({});
  const [selDrivers, setSelDrivers] = useState([]);
  const [selDriver, setSelDriver] = useState({});
  const [driverTreeObj, setDriverTreeObj] = useState([]);
  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value

  let location = useLocation();
  let navigate = useNavigate();

  //using the initial useEffect hook to open up the draft oplimits and prefill the form
  useEffect(() => {
    const getUserData = async () => {
      //this first part just ensures they whoever is on this page is an authenticated user; prevents someone from typing in the url and gaining access
      try {
        //these comes from the utils section of the code
        const token = loggedIn() ? getToken() : null;
        if (!token) {
          navigate("/");
        }
        const response = await getUser(token);
        if (!response.data) {
          navigate("/");
          throw new Error("something went wrong!");
        }
        const user = response.data;
        //used to make sure they have permissions to make changes
        setState({
          ...state,
          firstName: user.firstName,
          lastName: user.lastName,
          Role: user.userRole,
          userID: user.id,
        });
        let userDataLength = Object.keys(user).length;
        //if the user isnt logged in with an unexpired token, send them to the login page
        if (!userDataLength > 0) {
          navigate("/");
        }
      } catch (err) {
        console.error(err);
      }
    };
    //set location state if sent there by the table
  
    // location.state.selOutcome.id=selOutcome.id;
    let dtree = [];
    const getOutcomeData = async () => {
      //todo:  Clean this up so that the navbar always has the correct outcome selected
      let outcomeID;
      if (location.state) {
        outcomeID = location.state.selOutcome.id;
      } else {
        outcomeID = 1;
      }
      await getOutcome(outcomeID).then((data) => {
        setSelOutcome(data.data);
      });
    };

    const getDriversData = async () => {
      await getDriverByOutcome(location.state.selOutcome.id).then((data) => {
        setDriverTreeObj(data.data);
      });
    };

    getUserData();
    getOutcomeData();
    getDriversData();
    setState({ ...state, selOutcome: selOutcome });
    //this one gets the initial draftOL for the form
  }, []);

  useEffect(() => {
    let dtree;  
    // console.log("location: "+JSON.stringify(location.state));
    // console.log("location state v2: "+ JSON.stringify(location.state));
    const getDriversData = async () => {
      await getDriverByOutcome(selOutcome.id).then((data) => {
        setSelDrivers(data.data);
        dtree = data.data;
        setDriverTreeObj(dtree);
        //TODO set up an object that will calc how many levels and only display the correct number of columns
        // function drivertiers() {
        // for (let i = 0; i < data.data.length; i++) {
        //   let level = data.data[i].tierLevel - 1; //tier level is 1 based, array is 0 based
        //   dtree[level].unshift(data.data[i]);
      });
    };

    getDriversData();
    setState({ ...state, selOutcome: selOutcome });
    // window.location.reload(false);
  }, [selOutcome]);

  //sets the initial selection of the drop down lists for the signatures, i couldnt get the map function to work, so brute force here we go.

  //this function gets everyone with an assigened role and sets the state for the drop down lists

  const newOutcome = () => {
    createOutcome().then((data) => {
      setSelOutcome(data.data);
    });
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

  const delDriver = (e) => {
    e.preventDefault();
    console.log(e.target.id);
    deleteDriver(e.target.id);
    getOutcome(selOutcome.id).then((data) => {
      setSelOutcome(data.data);
    });
    window.location.reload(false);
  };

  const goToOutcome = async (e) => {
    navigate("/allOutcomes", {
      state: { selOutcome: selOutcome.id },
    });
  };

  const goToDriver = async (e) => {
    console.log(e.target);
    navigate("/drpage", {
      state: { selDriver: e.target.id, selOutcome: selOutcome.id },
    });
  };

  function tierOneCards() {
    const arr = [];
    if (!driverTreeObj) {
      return <div>Nuts</div>;
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
            driverTreeObj[j].tierLevel === 1 &&
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
              data-tier={1}
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
              data-tier={1}
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
                <Card.Footer className={styles.card_footer}>
                  <Button
                    className={styles.card_trash}
                    onClick={delDriver}
                    id={arr[index].id}
                  ></Button>
                </Card.Footer>
              </Card>
            </div>
          );
        }
      });
    }
  }

  function tierTwoCards() {
    const arr = [];
    if (!driverTreeObj) {
      return <div>Nuts</div>;
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
            driverTreeObj[j].tierLevel === 2 &&
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
              data-tier={2}
              data-subtier={index + 1}
              id={"tier2subTier" + (index + 1)}
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
              data-tier={2}
              data-subtier={index + 1}
              id={"tier2subTier" + (index + 1)}
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
                <Card.Footer className={styles.card_footer}>
                  <Button
                    className={styles.card_trash}
                    onClick={delDriver}
                    id={arr[index].id}
                  ></Button>
                </Card.Footer>
              </Card>
            </div>
          );
        }
      });
    }
  }

  function tierThreeCards() {
    const arr = [];
    if (!driverTreeObj) {
      return <div>Nuts</div>;
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
            driverTreeObj[j].tierLevel === 3 &&
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
              data-tier={3}
              data-subtier={index + 1}
              id={"tier3subTier" + (index + 1)}
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
              data-tier={3}
              data-subtier={index + 1}
              id={"tier3subTier" + (index + 1)}
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
                <Card.Footer className={styles.card_footer}>
                  <Button
                    className={styles.card_trash}
                    onClick={delDriver}
                    id={arr[index].id}
                  ></Button>
                </Card.Footer>
              </Card>
            </div>
          );
        }
      });
    }
  }

  function tierFourCards() {
    const arr = [];
    if (!driverTreeObj) {
      return <div>Nuts</div>;
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
            driverTreeObj[j].tierLevel === 4 &&
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
              data-tier="4"
              data-subtier={index + 1}
              id={"tier4subTier" + (index + 1)}
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
              data-tier="4"
              data-subtier={index + 1}
              id={"tier4subTier" + (index + 1)}
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
                <Card.Footer className={styles.card_footer}>
                  <Button
                    className={styles.card_trash}
                    onClick={delDriver}
                    id={arr[index].id}
                  ></Button>
                </Card.Footer>
              </Card>
            </div>
          );
        }
      });
    }
  }

  function tierFiveCards() {
    const arr = [];
    if (!driverTreeObj) {
      return <div>Nuts</div>;
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
            driverTreeObj[j].tierLevel === 5 &&
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
              data-tier="5"
              data-subtier={index + 1}
              id={index + 1}
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
              data-tier="5"
              data-subtier={index + 1}
              id={index + 1}
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
                <Card.Footer className={styles.card_footer}>
                  <Button
                    className={styles.card_trash}
                    onClick={delDriver}
                    id={arr[index].id}
                  ></Button>
                </Card.Footer>
              </Card>
            </div>
          );
        }
      });
    }
  }

  function allowDrop(e) {
    //this property gets set on the individual divs onDragOver property to limit where a card can be dropped
    e.preventDefault();
  }

  function drag(e) {
    console.log("farg target: " + e.target.id);
    e.dataTransfer.setData("text", e.target.id);
  }

  function drop(e) {
    //on drop, sets the drivers new Tier and subTier as required.  The driver is then updated in the database so it will be placed in its new place on the next render
    e.preventDefault();
    console.log("drop target: " + e.target.dataset.tier);
    console.log("drop target subtier: " + e.target.dataset.subtier);
    var data = e.dataTransfer.getData("text");
    console.log("drag target: " + data);
    e.target.appendChild(document.getElementById(data));
    let body = {
      tierLevel: e.target.dataset.tier,
      subTier: e.target.dataset.subtier,
    };
    updateDriver(data, body);
    // window.location.reload(false);
  }

  return (
    <>
      <div className={styles.driver_page}>
        <Container fluid className="justify-content-center">
          <Col className={styles.my_col}>
            <Row
              className="justify-content-center m-1"
              styles={{ height: "75px" }}
            >
              <Button
                className={styles.my_btn}
                style={{ width: "200px", height: "50px" }}
                onClick={newOutcome}
              >
                Create New Outcome
              </Button>
              {/* </Col> */}
            </Row>

            <Row className={styles.outcome}>
              <Col className={styles.outcome}>
                <Card className={styles.my_card} onClick={goToOutcome}>
                  <Card.Body className={styles.my_card_body}>
                    <Card.Text className={styles.my_card_text}>{selOutcome.outcomeTitle}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col className={styles.driver} key="1">
                <p>Tier 1 Drivers</p>
                <Row
                  style={{
                    height: "700px",
                    width: "100%",
                  }}
                  className="m-1"
                >
                  {tierOneCards()}
                </Row>
                <Row style={{ height: "50px" }}>
                  <Button
                    className={styles.my_btn}
                    onClick={newDriver}
                    data-tier="1"
                  >
                    +
                  </Button>
                </Row>
              </Col>

              <Col className={styles.driver}>
                <p>Tier 2 Drivers</p>
                <Row style={{ height: "700px" }} className="m-1">
                  {tierTwoCards()}
                </Row>
                <Row style={{ height: "50px", padding: "1px" }}>
                  <Button
                    className={styles.my_btn}
                    onClick={newDriver}
                    data-tier="2"
                  >
                    +
                  </Button>
                </Row>
              </Col>

              <Col className={styles.driver}>
                <p>Tier 3 Drivers</p>
                <Row style={{ height: "700px" }} className="m-1">
                  {tierThreeCards()}
                </Row>
                <Row style={{ height: "50px" }}>
                  <Button
                    className={styles.my_btn}
                    onClick={newDriver}
                    data-tier="3"
                  >
                    +
                  </Button>
                </Row>
              </Col>

              <Col className={styles.driver}>
                <p>Tier 4 Drivers</p>
                <Row style={{ height: "700px" }} className="m-1">
                  {tierFourCards()}
                </Row>
                <Row style={{ height: "50px" }}>
                  <Button
                    className={styles.my_btn}
                    onClick={newDriver}
                    data-tier="4"
                  >
                    +
                  </Button>
                </Row>
              </Col>

              <Col className={styles.driver}>
                <p>Tier 5 Drivers</p>
                <Row style={{ height: "700px" }} className="m-1">
                  {tierFiveCards()}
                </Row>
                <Row style={{ height: "50px" }}>
                  <Button
                    className={styles.my_btn}
                    onClick={newDriver}
                    data-tier="5"
                  >
                    +
                  </Button>
                </Row>
              </Col>

              <Col className="justify-content-center driver" sm={10} md={3}>
                <Row>
                  <Legend stakeholders={selOutcome.legend} />
                </Row>
              </Col>
            </Row>

            <Row style={{ height: "250px" }}>
              <OutcomeTable
                selDriver={selDriver}
                setSelDriver={setSelDriver}
                selOutcome={selOutcome}
                setSelOutcome={setSelOutcome}
              />
            </Row>
          </Col>
        </Container>
      </div>
    </>
  );
};

export default DriverTreePage;
