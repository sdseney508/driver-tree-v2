//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
// import Select from "react-select";
import { stateContext } from "../App";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  createOutcome,
  getOutcome,
  getDrivers,
  getDriverByOutcome,
} from "../utils/drivers";
import { useNavigate, useLocation } from "react-router";
import { getUser, loggedIn, getToken } from "../utils/auth";

import styles from "./DriverTreePage.module.css";
import OutcomeTable from "../components/OutcomeTable";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const DriverTreePage = ({outcome}) => {
  // debugger;
  const [state, setState] = useContext(stateContext);
  const [selOutcome, setSelOutcome] = useState({outcome});
  const [selDrivers, setSelDrivers] = useState({});
  const [driverTreeObj, setDriverTreeObj] = useState([]);
  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value
  
  let location = useLocation();
  let navigate = useNavigate();

  // let driverTreeObj = [[], [], [], [], []];
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
    getUserData();
    //this one gets the initial draftOL for the form
  }, []);

  useEffect(() => {
    let dtree = [[], [], [], [], []];
    const getDriversData = async () => {
      console.log(selOutcome);
      if(!selOutcome.id){
        selOutcome.id = 1;
      };
      await getDriverByOutcome(selOutcome.id).then((data) => {
        // console.log(data.data);
        setSelDrivers(data.data);
        //TODO set up an object that will calc how many levels and only display the correct number of columns
        // function drivertiers() {
        for (let i = 0; i < data.data.length; i++) {
          let level = data.data[i].tierLevel - 1; //tier level is 1 based, array is 0 based
          dtree[level].unshift(data.data[i]);
        }
      });
    };
    selOutcome
      ? getDriversData(selOutcome.id)
      : console.log("no outcome selected");
    setDriverTreeObj(dtree);
    setState({ ...state, selOutcome: selOutcome });
    console.log("state", state);
  }, [,selOutcome]);

  //sets the initial selection of the drop down lists for the signatures, i couldnt get the map function to work, so brute force here we go.

  //this function gets everyone with an assigened role and sets the state for the drop down lists

  const newOutcome = () => {
    createOutcome().then((data) => {
      setSelOutcome(data.data);
    });
  };

  const goToDriver = async (e) => {
    console.log(e.target.outcomeID);
    await setState({ ...state, selDriver: e.target.id, selOutcome: selOutcome.id });
    console.log(state);
    navigate("/drpage", {state: {selDriver: e.target.id, selOutcome: selOutcome.id}});
  };

  //creates the cards for each of the columns.  the cards will have a listener that will open a separate page for the specific driver.  each teir gets a map
  //TODO make this a callable function in the utils folder and import just the function then call it by tiers.
  function tierOneCards() {
    if (!driverTreeObj[0]) {
      return <div></div>;
    } else {
      return driverTreeObj[0].map((f, index) => {
        return (
          <Card className={styles.card} onClick={goToDriver}>
            <Card.Body id={driverTreeObj[0][index].id}>
              <Card.Text> {driverTreeObj[0][index].problemStatement}</Card.Text>
            </Card.Body>
          </Card>
        );
      });
    }
  }

  function tierTwoCards() {
    if (!driverTreeObj[1]) {
      return <div></div>;
    } else {
      return driverTreeObj[1].map((f, index) => {
        return (
          <Card className={styles.card}>
            <Card.Body>
              <Card.Text> {driverTreeObj[1][index].problemStatement}</Card.Text>
            </Card.Body>
          </Card>
        );
      });
    }
  }

  function tierThreeCards() {
    if (!driverTreeObj[2]) {
      return <div></div>;
    } else {
      return driverTreeObj[2].map((f, index) => {
        return (
          <Card className={styles.card}>
            <Card.Body>
              <Card.Text> {driverTreeObj[2][index].problemStatement}</Card.Text>
            </Card.Body>
          </Card>
        );
      });
    }
  }

  function tierFourCards() {
    if (!driverTreeObj[3]) {
      return <div></div>;
    } else {
      return driverTreeObj[3].map((f, index) => {
        return (
          <Card className={styles.card}>
            <Card.Body>
              <Card.Text> {driverTreeObj[3][index].problemStatement}</Card.Text>
            </Card.Body>
          </Card>
        );
      });
    }
  }

  function tierFiveCards() {
    if (!driverTreeObj[4]) {
      return <div></div>;
    } else {
      return driverTreeObj[4].map((f, index) => {
        return (
          <Card className={styles.card}>
            <Card.Body>
              <Card.Text> {driverTreeObj[4][index].problemStatement}</Card.Text>
            </Card.Body>
          </Card>
        );
      });
    }
  }

  return (
    <>
      <div className={styles.driver_page}>
        <Container fluid className="justify-content-center">
          <div>
            <Row className="justify-content-center" style={{ height: "10vh" }}>
              <Button
                className={styles.my_btn}
                style={{ width: "200px" }}
                onClick={newOutcome}
              >
                Create New Outcome
              </Button>
              {/* </Col> */}
            </Row>

            <Row className={styles.outcome} style={{ height: "85vh" }}>
              <Col className={styles.outcome}>
                <Card className={styles.card}>
                  <Card.Body>
                    <Card.Text>{selOutcome.outcomeTitle}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col className={styles.driver}>
                <Row style={{ height: "80vh" }} className="m-1">
                  <p>Tier 1 Drivers</p>
                  {tierOneCards()}
                </Row>
                <Row style={{ height: "10vh" }}>
                  <Button className={styles.my_btn}>+</Button>
                </Row>
              </Col>

              <Col className={styles.driver}>
                <Row style={{ height: "80vh" }} className="m-1">
                  <p>Tier 2 Drivers</p>
                  {tierTwoCards()}
                </Row>
                <Row style={{ height: "10vh" }}>
                  <Button className={styles.my_btn}>+</Button>
                </Row>
              </Col>

              <Col className={styles.driver}>
                <Row style={{ height: "80vh" }} className="m-1">
                  <p>Tier 3 Drivers</p>
                  {tierThreeCards()}
                </Row>
                <Row style={{ height: "10vh" }}>
                  <Button className={styles.my_btn}>+</Button>
                </Row>
              </Col>

              <Col className={styles.driver}>
                <Row style={{ height: "80vh" }} className="m-1">
                  <p>Tier 4 Drivers</p>
                  {tierFourCards()}
                </Row>
                <Row style={{ height: "10vh" }}>
                  <Button className={styles.my_btn}>+</Button>
                </Row>
              </Col>

              <Col className={styles.driver}>
                <Row style={{ height: "80vh" }} className="m-1">
                  <p>Tier 5 Drivers</p>
                  {tierFiveCards()}
                </Row>
                <Row style={{ height: "10vh" }}>
                  <Button className={styles.my_btn}>+</Button>
                </Row>
              </Col>

              <Col className="justify-content-center driver" sm={10} md={3}>
                Legend Goes Here
              </Col>
            </Row>

            <Row className="mt-5" style={{ height: "20vh" }}>
              <OutcomeTable
                selDrivers={selDrivers}
                setSelDrivers={setSelDrivers}
                selOutcome={selOutcome}
                setSelOutcome={setSelOutcome}
              />
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default DriverTreePage;
