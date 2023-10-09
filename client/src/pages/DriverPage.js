//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import { stateContext } from "../App";
import { getUser, loggedIn, getToken } from "../utils/auth";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { getDriver, getDriverByOutcome } from "../utils/drivers";
import { useNavigate } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faArrowLeft, faArrowUp, faArrowDown} from "@fortawesome/free-solid-svg-icons";
import styles from "./DriverPage.module.css";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const DriverPage = () => {
  const [state, setState] = useContext(stateContext);
  const [selDrivers, setSelDrivers] = useState([]);
  const [selDriver, setSelDriver] = useState({});
  const navigate = useNavigate();

  // this is getting the user data from the database to properly populate the form.  None of the form data is being updated in the database. until after you hit submit.
  useEffect(() => {
    const getUserData = async () => {
      try {
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
        setState({
          ...state,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          id: user.id,
          userRole: user.userRole,
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

    const getAppData = async () => {
      let outcomeID = state.outcomeID;
      let selDriver = state.selDriver;
      if(!state.outcomeID){
        await setState({...state, outcomeID: 1})
        outcomeID = 1;

      };
      if(!state.selDriver){
        await setState({...state, selDriver: 1})
        selDriver = 1;
      };
      console.log("state: ", state)
      await getDriverByOutcome(outcomeID).then((data) => {
        let top = data.data;
        setSelDrivers(top);
      });
      await getDriver(selDriver).then((data) => {
        let top = data.data;
        console.log("top: ", top);
        setSelDriver(top);
      });
    };

    getUserData();
    getAppData();
    console.log("state", state);
  }, []);

  const handleInputChange = (event) => {};

  const handleFormSubmit = async (event) => {};

  const buttonClicked = () => {
    alert ("button clicked");
  }

  return (
    <>
      <div className={styles.driver_page}>
        <Container className={styles.driver_page}>
          <div className={styles.driver_page}>
            <h2
              className="text-center fw-bolder"
              style={{ "text-shadow": "1px 1px 1px grey" }}
            >
              Driver Details
            </h2>
            <FontAwesomeIcon icon={faArrowLeft} className={styles.arrows} onClick={buttonClicked}/>
            <FontAwesomeIcon icon={faArrowRight} className={styles.arrows}/>
            <FontAwesomeIcon icon={faArrowUp} className={styles.arrows}/>
            <FontAwesomeIcon icon={faArrowDown} className={styles.arrows}/>
                <br/>
              Driver Tier: {selDriver.tierLevel}
          </div>
          <Form className={styles.my_form}>
            <Row className={styles.quad_format + styles.my_row}>
                <Col className={styles.my_col}>
                  <Form.Group style={{ width: "100%" }}>
                    <Form.Label>Problem Statement</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={selDriver.problemStatement || ""}
                      name="driverName"
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group style={{ width: "100%" }}>
                    <Form.Label>Barriers</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={selDriver.barriers || ""}
                      name="driverName"
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              
              <Col className={styles.my_col}>
                <Form.Group>
                  <Form.Label>Background</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={selDriver.background || ""}
                    name="driverName"
                    style={{ width: "100%" }}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className={styles.quad_format + styles.my_row}>
              <Col className={styles.my_col}>
                <Form.Group>
                  <Form.Label>Barriers</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={selDriver.barrier || ""}
                    name="driverName"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col className={styles.my_col}>
                <Form.Group>
                  <Form.Label>Deliverables</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={selDriver.deliverables || ""}
                    name="driverName"
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Desired Outcomes</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={selDriver.desiredOutcomes || ""}
                    name="driverName"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default DriverPage;
