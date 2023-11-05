//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
// import Select from "react-select";
import { stateContext } from "../App";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import { getUser, loggedIn, getToken } from "../utils/auth";
import {
  createOutcome,
  getDriverByOutcome,
  getOutcome,
  updateOutcome,
} from "../utils/drivers";
import styles from "./OutcomesPage.module.css";
import OutcomeTable from "../components/OutcomeTable";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const OutcomesPage = () => {
  const [state, setState] = useContext(stateContext);
  const [selOutcome, setSelOutcome] = useState({});
  const [selDrivers, setSelDrivers] = useState({});
  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value
  let navigate = useNavigate();

  const { outcomeID } = useParams();
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

    const getOutcomeData = async () => {
      if (!outcomeID) {
        // eslint-disable-next-line react-hooks/exhaustive-deps, no-const-assign
        outcomeID = 1;
      }
      await getOutcome(outcomeID).then((data) => {
        console.log(data.data);
        setSelOutcome(data.data);
      });
      await getDriverByOutcome(outcomeID).then((data) => {
        let top = data.data;

        setSelDrivers(top);
      });
    };

    getUserData();
    getOutcomeData();
    getDrivers();
    //this one gets the initial draftOL for the form
  }, []);

  const getDrivers = async () => {
    await getDriverByOutcome(selOutcome.id).then((data) => {
      let top = data.data;
      setSelDrivers(top);
    });
  };

  //sets the initial selection of the drop down lists for the signatures, i couldnt get the map function to work, so brute force here we go.
  useEffect(() => {
    getDrivers();
    setState({ ...state, selOutcome: selOutcome });
    navigate("/allOutcomes/" + selOutcome.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selOutcome]);

  //this function gets everyone with an assigened role and sets the state for the drop down lists

  const barriers = () => {
    if (!selDrivers[0]) {
      return <div></div>;
    } else {
      return selDrivers.map((f, index) => {
        if (f.tierLevel !== 1) {
          return <div></div>;
        } else {
          return (
            <div>
              <Link to={`/drpage/${selOutcome.id}/${selDrivers[index].id}`}>
                <p>{selDrivers[index].problemStatement}</p>
              </Link>
            </div>
          );
        }
      });
    }
  };

  const newOutcome = async () => {
    createOutcome().then((data) => {
      setState({ ...state, outcomeID: data.data.id });
      setSelOutcome(data.data);
    });
  };

  const handleInputChange = (e) => {
    setSelOutcome({ ...selOutcome, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let body;
    if (e.target.name === "outcomeTitle") {
      body = { [e.target.name]: e.target.value, 'problemStatement': e.target.value};
      updateOutcome(selOutcome.id, body);
    } else {
      body = { [e.target.name]: e.target.value };
    };
    updateOutcome(selOutcome.id, body);
    setSelOutcome({ ...selOutcome, [e.target.name]: e.target.value });
  };

  const driverPage = () => {
    navigate("/drivertree/" + selOutcome.id);
  };

  return (
    <>
      <div className={styles.outcome_page}>
        <Container>
          <div className={styles.my_div}>
            <Col className={styles.my_col}>
              {/* <Col className={styles.my_col} sm={6} md={3} lg={3}> */}
              <Button className="p-1 m-1" onClick={newOutcome}>
                Create New Outcome
              </Button>
              {/* </Col> */}
              {/* <Col  className={styles.my_col} sm={6} md={3} lg={3}> */}
              <Button className="p-1 m-1" onClick={driverPage}>
                View Driver Tree
              </Button>

              {/* </Col> */}
            </Col>
            <Form className={styles.my_form}>
              <Row className={styles.outcome_banner + styles.my_row}>
                <Col sm={10} md={6} lg={8} className={styles.outcome_name}>
                  <Form.Group style={{ width: "100%" }}>
                    <Form.Control
                      className={styles.outcome_name}
                      as="input"
                      value={selOutcome.outcomeTitle}
                      name="outcomeTitle"
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col sm={10} md={6} lg={4} className={styles.commander_name}>
                  <Row className={styles.my_row}>
                    <Form.Group style={{ width: "100%" }}>
                      <Row className={styles.my_row}>
                        <Form.Label className={styles.commander_label}>
                          Supported Commander:
                        </Form.Label>
                        <Form.Control
                          className={styles.commander_name}
                          as="input"
                          value={selOutcome.supportedCommanders}
                          name="supportedCommanders"
                          onChange={handleInputChange}
                          onBlur={handleFormSubmit}
                        ></Form.Control>
                      </Row>
                    {/* </Form.Group>
    
                    <Form.Group style={{ width: "100%" }}> */}
                      <Row className={styles.my_row}>
                        <Form.Label className={styles.commander_label}>
                          Action Officer:
                        </Form.Label>
                        <Form.Control
                          className={styles.commander_name}
                          as="input"
                          value={selOutcome.leadActionOfficer}
                          name="leadActionOfficer"
                          onChange={handleInputChange}
                          onBlur={handleFormSubmit}
                        ></Form.Control>
                      </Row>
                    </Form.Group>
                  </Row>
                  {/* <Row className="p-1">Supported Commander: ADM John Doe</Row>
                  <Row className="p-1">Lead Action Officer: CAPT Jane Doe</Row> */}
                </Col>
              </Row>
            </Form>
            <Row>
              <Col sm={10} md={6} lg={4}>
                <p className={styles.my_p}>Gap Characerization</p>
                <Form className={styles.my_form}>
                  {/* <Form.Group style={{ width: "100%" }}>
                    <Form.Label className={styles.form_label}>
                      Problem Statement
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      className={styles.my_text_area}
                      value={selOutcome.goals || ""}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="goals"
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group> */}

                  <Form.Group style={{ width: "100%" }}>
                    <Form.Label className={styles.form_label}>
                      Baseline Performance
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      className={styles.my_text_area}
                      value={selOutcome.baselinePerformance || ""}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="baselinePerformance"
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>

                  <Form.Group style={{ width: "100%" }}>
                    <Form.Label className={styles.form_label}>
                      Root Causes / Priority Levers
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      className={styles.my_text_area}
                      value={selOutcome.rootCauses || ""}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="rootCauses"
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>

                  <Form.Group style={{ width: "100%" }}>
                    <Form.Label className={styles.form_label}>
                      Assumptions
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      className={styles.my_text_area}
                      value={selOutcome.assumptions || ""}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="assumptions"
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>
                </Form>
              </Col>

              <Col sm={10} md={6} lg={4}>
                <p className={styles.my_p}>Gap Closure</p>
                <Form className={styles.my_form}>
                  <Form.Group style={{ width: "100%" }}>
                    <Form.Label className={styles.form_label}>Scope</Form.Label>
                    <Form.Control
                      as="textarea"
                      className={styles.my_text_area}
                      value={selOutcome.scope || ""}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="scope"
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>

                  <Form.Group style={{ width: "100%" }}>
                    <Form.Label className={styles.form_label}>
                      Goals (w/ Date & Annual Target)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      className={styles.my_text_area}
                      value={selOutcome.goals || ""}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="goals"
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>

                  <Form.Group style={{ width: "100%" }}>
                    <Form.Label className={styles.form_label}>
                      Measured By:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      className={styles.my_text_area}
                      value={selOutcome.measurements || ""}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="measurements"
                      onChange={handleInputChange}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col sm={10} md={6} lg={4}>
                <p className={styles.my_p}>Stakeholders & Barriers</p>
                <Form.Group style={{ width: "100%" }}>
                  <Form.Label className={styles.form_label}>
                    C2: Supporting Commanders
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    className={styles.my_text_area}
                    value={selOutcome.supportingCommanders || ""}
                    //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                    name="supportingCommanders"
                    onChange={handleInputChange}
                    onBlur={handleFormSubmit}
                  />
                </Form.Group>

                <Form.Group style={{ width: "100%" }}>
                  <Form.Label className={styles.form_label}>
                    C2: Stakeholders
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    className={styles.my_text_area}
                    value={selOutcome.stakeholders || ""}
                    //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                    name="stakeholders"
                    onChange={handleInputChange}
                    onBlur={handleFormSubmit}
                  />
                </Form.Group>

                <Form.Group style={{ width: "100%" }}>
                  <Form.Label className={styles.form_label}>
                    Tier 1 Drivers/Barriers
                  </Form.Label>
                  {barriers()}
                </Form.Group>
              </Col>
            </Row>

            <Row style={{ height: "250px" }}>
              <OutcomeTable
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

export default OutcomesPage;
