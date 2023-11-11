//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import { stateContext } from "../App";
import { getUser, loggedIn, getToken } from "../utils/auth";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import {
  getDriver,
  getDriverByOutcome,
  getOutcome,
  updateDriver,
} from "../utils/drivers";
import DriverTable from "../components/DriversTable";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./DriverPage.module.css";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const DriverPage = () => {
  const [state, setState] = useContext(stateContext);
  const [selDrivers, setSelDrivers] = useState([]);
  const [selDriver, setSelDriver] = useState({});
  const [selOutcome, setSelOutcome] = useState({});
  const navigate = useNavigate();

  let { outcomeID, driverID } = useParams();
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
        navigate("/");
      }
    };

    const getAppData = async () => {
      if (!outcomeID) {
        outcomeID = 1;
      }
      await getDriverByOutcome(outcomeID).then((data) => {
        let top = data.data;
        setSelDrivers(top);
      });
      await getOutcome(outcomeID).then((data) => {
        let top = data.data;
        setSelOutcome(top);
      });
      if (!driverID) {
        driverID = selDrivers[0].id;
      }
      await getDriver(driverID).then((data) => {
        let top = data.data;
        setSelDriver(top);
      });
    };

    getUserData();
    getAppData();
  }, []);

  useEffect(() => {
    navigate("/drpage/" + outcomeID + "/" + selDriver.id);
  }, [selDriver]);

  const handleInputChange = (e) => {
    setSelDriver({ ...selDriver, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let body = { [e.target.name]: e.target.value };
    console.log("body: ", body);
    updateDriver(selDriver.id, body);
    setSelDriver({ ...selDriver, [e.target.name]: e.target.value });
  };

  const buttonClicked = () => {
    alert("button clicked");
  };

  const backToDriverTree = () => {
    navigate("/drivertree/" + selOutcome.id);
  };

  return (
    <>
      <div className={styles.driver_page}>
        <Container className={styles.driver_page}>
          <div>
            <Form className={styles.my_form}>
              <div className={styles.driver_page}>
                <h2
                  className="text-center fw-bolder"
                  style={{ "text-shadow": "1px 1px 1px grey" }}
                >
                  Driver Details
                </h2>
                <Button
                  className={styles.back_button}
                  onClick={backToDriverTree}
                >
                  Back to Driver Tree
                </Button>
                <br />
              </div>
              <Form.Group>
                <Row className={styles.tier_row}>
                  Driver Tier
                  <Form.Control
                    as="select"
                    id="tierLevel"
                    value={selDriver.tierLevel}
                    //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                    name="tierLevel"
                    onChange={handleInputChange}
                    onBlur={handleFormSubmit}
                    style={{ width: "40px" }}
                  >
                    <option key={1} value={1}>
                      1
                    </option>
                    <option key={2} value={2}>
                      2
                    </option>
                    <option key={3} value={3}>
                      3
                    </option>
                    <option key={4} value={4}>
                      4
                    </option>
                    <option key={5} value={5}>
                      5
                    </option>
                  </Form.Control>
                </Row>
              </Form.Group>

              {/* Driver Tier: {selDriver.tierLevel} */}
              <Row className={styles.quad_format}>
                <Col className={styles.my_col}>
                  <Form.Group style={{ width: "100%" }}>
                    <Form.Label>Problem Statement</Form.Label>
                    <Form.Control
                      as="textarea"
                      className={styles.my_text_area}
                      value={selDriver.problemStatement || ""}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="problemStatement"
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>

                  <Form.Group style={{ width: "100%" }}>
                    <Form.Label>Barriers</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={selDriver.barrier || ""}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="barrier"
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>
                </Col>

                <Col className={styles.my_col}>
                  <Form.Group>
                    <Col>
                      {/* <Row className={styles.my_row}> */}
                      <Row>
                        <Form.Label className={styles.background_label}>
                          Background
                        </Form.Label>
                        <Form.Label className={styles.status_label}>
                          Status
                        </Form.Label>
                        <Form.Control
                          as="select"
                          id="status"
                          value={selDriver.status}
                          className={
                            selDriver.status === "Green"
                              ? styles.green_status
                              : selDriver.status === "Yellow"
                              ? styles.yellow_status
                              : styles.red_status
                          }
                          //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                          name="status"
                          onChange={handleInputChange}
                          onBlur={handleFormSubmit}
                          style={{ width: "100px" }}
                        >
                          <option
                            key={1}
                            value={"Green"}
                            className={styles.green_status}
                          >
                            Green
                          </option>
                          <option
                            key={2}
                            value={"Yellow"}
                            className={styles.yellow_status}
                          >
                            Yellow
                          </option>
                          <option
                            key={3}
                            value={"Red"}
                            className={styles.red_status}
                          >
                            Red
                          </option>
                        </Form.Control>
                      </Row>
                      {/* </Row> */}
                    </Col>
                    <Form.Control
                      as="textarea"
                      className={styles.background_text}
                      value={selDriver.background || ""}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="background"
                      style={{ width: "100%" }}
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className={styles.quad_format}>
                <Col className={styles.my_col}>
                  <Form.Group>
                    <Form.Label>Progress</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={selDriver.progress || ""}
                      style={{height: "150px" }}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="progress"
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>

                  <Row className={styles.abbrev_row}>
                    <Form.Group>
                      <Col>
                        <Row>
                          <Col>
                            {" "}
                            <Form.Label>Stakeholder</Form.Label>
                            <Form.Control
                              as="textarea"
                              value={selDriver.stakeholders || ""}
                              style={{ width: "40%", height: "30px" }}
                              //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                              name="stakeholders"
                              onChange={handleInputChange}
                              onBlur={handleFormSubmit}
                            />
                          </Col>
                          <Col>
                            {" "}
                            <Form.Label>Abbreviation</Form.Label>
                            <Form.Control
                              as="textarea"
                              value={selDriver.stakeholderAbbreviation || ""}
                              style={{ width: "40%", height: "30px" }}
                              //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                              name="stakeholderAbbreviation"
                              onChange={handleInputChange}
                              onBlur={handleFormSubmit}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Form.Group>
                  </Row>
                </Col>
                <Col className={styles.my_col}>
                  <Form.Group>
                    <Form.Label>Deliverables</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={selDriver.deliverables || ""}
                      name="Deliverables"
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Desired Outcomes</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={selDriver.desiredOutcomes || ""}
                      name="desiredOutcomes"
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
            <p className={styles.copyright}>&#169; Integrated Program Solutions, Inc</p>
          </div>

          <Row style={{ height: "250px" }}>
            <DriverTable
              selDrivers={selDrivers}
              setSelDrivers={setSelDrivers}
              selDriver={selDriver}
              setSelDriver={setSelDriver}
              selOutcome={selOutcome}
              setSelOutcome={setSelOutcome}
            />
          </Row>
        </Container>
      </div>
    </>
  );
};

export default DriverPage;
