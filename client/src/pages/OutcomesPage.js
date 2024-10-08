//page for viewing and updating op limits
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import { getUserData } from "../utils/auth";
import {
  createOutcome,
  deleteOutcome,
  getDriverByOutcome,
  getOutcome,
  outcomeByCommand,
  updateOutcome,
} from "../utils/drivers";
// import { getAllClassificationDefinitions } from "../utils/classification";
import styles from "./OutcomesPage.module.css";
import OutcomeTable from "../components/OutcomeTable";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const OutcomesPage = () => {
  const [state, setState] = useState({});
  const [selOutcome, setSelOutcome] = useState({});
  const [driverTreeObj, setDriverTreeObj] = useState([]);
  const [recordLockState, setRecordLockState] = useState(false);
  //These are the initial states for the select boxes.  They are set to the first valuein the array, which is the default value
  let navigate = useNavigate();

  const { outcomeId } = useParams();

  //using the initial useEffect hook to open up the draft oplimits and prefill the form
  useEffect(() => {
    const getAppData = async (state) => {
      if (outcomeId === 0) {
        newOutcome();
      } else {
        await getOutcome(outcomeId).then((data) => {
          if (!data.data) {
            navigate("/user");
            return;
          }
          setSelOutcome(data.data);
        });
      }
    };
    
    getUserData({ navigate, state, setState, outcomeId });
    getAppData(state);
    setState({ ...state, selOutcome: selOutcome });
    if (state.userRole === "Stakeholder") {
      setRecordLockState(true);
    }
  }, []);

  //sets the initial selection of the drop down lists for the signatures, i couldnt get the map function to work, so brute force here we go.
  useEffect(() => {
    const getDrivers = async () => {
      if (!selOutcome.id) {
        selOutcome.id = outcomeId;
      }
      await getDriverByOutcome(selOutcome.id).then((data) => {
        let top = data.data;
        setDriverTreeObj(top);
      });
    };

    getDrivers();
    if (state.userRole === "Stakeholder") {
      setRecordLockState(true);
    }
    navigate("/allOutcomes/" + selOutcome.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selOutcome]);

const barriers = () => {
  console.log(driverTreeObj[1]);
    if (!driverTreeObj[1]) {
      return <div key={"nullbarrier"}></div>;
    } else {
      return driverTreeObj[1].map((f, index) => {
          return (
            <div key={"barriers" + index}>
              <Link
                to={`/drpage/${selOutcome.id}/${driverTreeObj[1][index].outcomeDrivers.driverId}`}
                key={"barrierslink" + index}
              >
                <p key={"p" + index}>{driverTreeObj[1][index].problemStatement}</p>
              </Link>
            </div>
          );
      });
    }
  };

  const deleteOutcomeFunc = async () => {
    //creates a temporary pop up modal to require the user to type in delete before executing the deleteOutcome call
    let del = prompt("Type 'delete' to delete this outcome");
    if (del === "delete") {
      let body = {userId: state.userId};
      console.log(body);
      deleteOutcome(selOutcome.id, state.userId);
      let toutcomeID;
      await outcomeByCommand(state.command).then((data) => {
        if (data) {
          toutcomeID = data.data[0].id;
        } else {
          toutcomeID = 0;
        }
      });
      navigate("/allOutcomes/" + toutcomeID);
    }
  };

  const newOutcome = async () => {
    if (recordLockState) {
      return;
    }

    let body = { stakeholderId: state.command, userId: state.userId };
    createOutcome(body).then((data) => {
      setState({ ...state, outcomeId: data.data.id });
      setSelOutcome(data.data);
    });
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    if (recordLockState) {
      return;
    }
    setSelOutcome({ ...selOutcome, [e.target.name]: e.target.value });
    let body = { [e.target.name]: e.target.value };
    updateOutcome(selOutcome.id, state.userId, body);
  };

  const handleFormSubmit = async (e) => {
    if (recordLockState) {
      return;
    }
    e.preventDefault();
    let body;
    if (e.target.name === "outcomeTitle") {
      body = {
        [e.target.name]: e.target.value,
        problemStatement: e.target.value,
      };
    } else {
      body = { [e.target.name]: e.target.value };
    }
    updateOutcome(selOutcome.id, state.userId, body);
    await getOutcome(selOutcome.id).then((data) => {
      setSelOutcome(data.data);
    });
  };

  const driverPage = () => {
    navigate("/drivertree/" + selOutcome.id);
  };

  return (
    <>
      <div className={styles.outcome_page}>
        <Container>
          <div className={styles.my_div}>
            <div>Welcome {state.firstName}</div>
            <Col className={styles.my_col}>
              <Button className="p-1 m-1" onClick={newOutcome}>
                Create New Outcome
              </Button>
              <Button className="p-1 m-1" onClick={driverPage}>
                View Driver Tree
              </Button>
              <Button variant="danger" className="p-1 m-1" onClick={deleteOutcomeFunc}>
                Delete Outcome
              </Button>
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
                      disabled={recordLockState}
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
                          value={selOutcome.supportedCommanders || ""}
                          name="supportedCommanders"
                          onChange={handleInputChange}
                          onBlur={handleFormSubmit}
                          disabled={recordLockState}
                        ></Form.Control>
                      </Row>
                      <Row className={styles.my_row}>
                        <Form.Label className={styles.commander_label}>
                          Action Officer:
                        </Form.Label>
                        <Form.Control
                          className={styles.commander_name}
                          as="input"
                          value={selOutcome.leadActionOfficer || ""}
                          name="leadActionOfficer"
                          onChange={handleInputChange}
                          onBlur={handleFormSubmit}
                          disabled={recordLockState}
                        ></Form.Control>
                      </Row>
                    </Form.Group>
                  </Row>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col sm={10} md={6} lg={4}>
                <p className={styles.my_p}>Gap Characerization</p>
                <Form className={styles.my_form}>
                  <Form.Group style={{ width: "100%" }}>
                    <Form.Label className={styles.form_label}>
                      Problem Statement
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      className={styles.my_text_area}
                      value={selOutcome.problemStatement || ""}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="problemStatement"
                      onChange={handleInputChange}
                      disabled={recordLockState}
                      onBlur={handleFormSubmit}
                    />
                  </Form.Group>

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
                      disabled={recordLockState}
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
                      disabled={recordLockState}
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
                      disabled={recordLockState}
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
                      disabled={recordLockState}
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
                      disabled={recordLockState}
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
                      disabled={recordLockState}
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
                    disabled={recordLockState}
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
                    disabled={recordLockState}
                  />
                </Form.Group>

                <div style={{ width: "100%" }}>
                  <div className={styles.form_label}>
                    Tier 1 Drivers/Barriers
                  </div>
                  {barriers()}
                </div>
              </Col>
            </Row>

            {selOutcome && state.command ? (
              <Row style={{ height: "250px" }}>
                <OutcomeTable
                  state={state}
                  setState={setState}
                  selOutcome={selOutcome}
                  setSelOutcome={setSelOutcome}
                  command={state.command}
                  userId={state.userId}
                />
              </Row>
            ) : null}
          </div>
        </Container>
      </div>
    </>
  );
};

export default OutcomesPage;
