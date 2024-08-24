//page for viewing and updating op limits
import React, { useState, useEffect } from "react";
import { getUserData } from "../utils/auth";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import {
  createOutcome,
  getDriverById,
  getDriverByOutcome,
  getOutcome,
  getUsers,
  updateDriver,
} from "../utils/drivers";
import { getAllClassificationDefinitions } from "../utils/classification";
import DriverTable from "../components/DriversTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./DriverPage.module.css";
import { exportElement } from "../utils/export-element";
import { savePDF } from "@progress/kendo-react-pdf";
import exportToPDF from "../utils/exportToPDF";
import e from "cors";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const DriverPage = () => {
  const [state, setState] = useState([]);
  const [users, setUserState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selDrivers, setSelDrivers] = useState([]);
  const [selDriver, setSelDriver] = useState({});
  const [selOutcome, setSelOutcome] = useState({});
  const [showModal, setShowMod] = useState(false);
  const [allquads, setAllQuads] = useState(false);
  const [classificationState, setClassificationState] = useState([]);
  const [selectedClassificationState, setSelectedClassificationState] =
    useState("CUI");
  const [recordLockState, setRecordLockState] = useState(false); //this is used to lock the record while someone is editing it.  It is set to true when someone is editing the record and false when they are not.
  const navigate = useNavigate();

  const { outcomeId, driverId } = useParams();
  // this is getting the user data from the database to properly populate the form.  None of the form data is being updated in the database. until after you hit submit.
  useEffect(() => {
    const getAppData = async () => {
      if (!outcomeId) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        outcomeId = 1;
      }
      await getDriverByOutcome(outcomeId).then((data) => {
        let top = data.data.flat();
        //remove the nulls
        top = top.filter((el) => {
          return el != null;
        });
        setSelDrivers(top);
      });
      await getOutcome(outcomeId).then((data) => {
        let top = data.data;
        setSelOutcome(top);
      });
      //TODO:  Open Classification is not working.  Need to fix this.
      // await getAllClassificationDefinitions().then((data) => {
      //   setClassificationState(data.data);
      // })
      if (!driverId) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        driverId = selDrivers[0].id;
      }

      await getDriverById(driverId).then((data) => {
        let top = data.data;
        setSelDriver(top);
      });
    };

    getUserData({ navigate, state, setState, outcomeId });
    getAppData();
    getAllUsers();
    setTimeout(() => {
      setLoading(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (selDriver.id) {
      navigate("/drpage/" + outcomeId + "/" + selDriver.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selDriver]);

  // //this function creates the drop down list for selecting the classification of a driver
  // const classificationSelect = () => {

  // }

  const backToDriverTree = () => {
    navigate("/drivertree/" + selOutcome.id);
  };

  //this function will create a new driver tree with the selected driver as the outcome.  It will then navigate to the new driver tree.
  const createEmbeddedDriverTree = async () => {
    //first we create the new outcome with the selected driver problem as the the outcome title
    let body = {
      outcomeTitle: selDriver.problemStatement,
      stakeholderId: state.command,
      userId: state.userId,
    };
    let newOutcome = await createOutcome(body);
    body = { embeddedOutcomeId: newOutcome.data.id };
    await updateDriver(selDriver.id, state.userId, body);
    navigate("/drivertree/" + newOutcome.data.id);
  };

  const exportPDFWithMethod = () => {
    handleClose();
    exportToPDF("pdf-export");
  };

  //this function generates the powerpoint style quad for the pdf export.
  const generateQuad = (selDriver) => {
    return (
      <Row id="pdf-export" className="pdf-export" style={{ margin: "1px" }}>
        <Form className={styles.my_form}>
          <Form.Group>
            <Row className={styles.tier_row}>
              <Col
                sm={3}
                md={3}
                lg={3}
                style={{ display: "flex", alignContent: "center" }}
              >
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
              </Col>
              <Col sm={6} md={6} lg={6}>
                <h2
                  className="text-center fw-bolder"
                  style={{ textShadow: "1px 1px 1px grey" }}
                >
                  Driver Details
                </h2>
              </Col>
            </Row>
          </Form.Group>
          <Row className={styles.quad_format}>
            <Col className={styles.my_col}>
              <Form.Group style={{ width: "100%" }}>
                <Form.Label>Problem Statement</Form.Label>
                <Form.Control
                  as="textarea"
                  // className={styles.my_text_area}
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
                  rows={3}
                  value={selDriver.barrier || ""}
                  //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                  name="barrier"
                  onChange={handleInputChange}
                  onBlur={handleFormSubmit}
                />
              </Form.Group>
            </Col>

            <Col className={styles.my_col}>
              <Form.Group style={{ width: "100%" }}>
                <Col>
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
                          : selDriver.status === "Red"
                          ? styles.red_status
                          : styles.blue_status
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
                </Col>
                <Form.Control
                  as="textarea"
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
              <Form.Group style={{ width: "100%" }}>
                <Form.Label>Progress</Form.Label>
                <Form.Control
                  as="textarea"
                  value={selDriver.progress || ""}
                  style={{ height: "150px" }}
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
                          style={{ width: "75%", height: "30px" }}
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
                      <Col>
                        {" "}
                        <Form.Label>Driver Owner</Form.Label>
                        <Form.Control
                          as="select"
                          name="driverOwner"
                          style={{ width: "85%", height: "50px" }}
                          //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                          onChange={handleInputChange}
                          onBlur={handleFormSubmit}
                          value={selDriver.driverOwner || " "}
                        >
                          <option>--Select a Driver Owner--</option>
                          {userOptions()}
                        </Form.Control>
                      </Col>
                    </Row>
                  </Col>
                </Form.Group>
              </Row>
            </Col>
            <Col className={styles.my_col}>
              <Form.Group style={{ width: "100%" }}>
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
              <Form.Group style={{ width: "100%" }}>
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
        <p className={styles.copyright}>
          <FontAwesomeIcon icon={faCopyright} /> Integrated Program Solutions,
          Inc
        </p>
        <h3 className="page-break"> </h3>
      </Row>
    );
  };

  const generateAllQuads = (selDrivers) => {
    return selDrivers.map((f, index) => {
      return generateQuad(selDrivers[index]);
    });
  };

  async function getAllUsers() {
    let userOpts = await getUsers().then((data) => {
      return data.data;
    });
    setUserState(userOpts);
  }

  // create the options for the stakeholder dropdown
  function userOptions() {
    return users.map((f, index) => {
      return (
        <option key={index} value={f.firstName + " " + f.lastName}>
          {f.firstName} {f.lastName}
        </option>
      );
    });
  }

  //close the modal
  const handleClose = () => {
    setShowMod(false);
  };

  const handleInputChange = (e) => {
    if (recordLockState) {
      return;
    }
    setSelDriver({ ...selDriver, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (recordLockState) {
      return;
    }
    let body = { [e.target.name]: e.target.value };
    updateDriver(selDriver.id, state.userId, body);
    setSelDriver({ ...selDriver, [e.target.name]: e.target.value });
  };

  //this function loops through all the selDrivers, creates the quad style format for each driver, and then writes it to the pdf.  The page-break on the end of the loop is what creates the new page for each driver.
  const writePDF = async () => {
    handleClose();
    //TODO:  Move this to a server side rendering function.  This is a temporary fix to get the pdf to render properly.
    await setAllQuads(true);
    let element = document.querySelector(".all-quads");
    //then write all of the elements to the pdf
    exportElement(element, {
      forcePageBreak: ".page-break",
    });
    setAllQuads(false);
  };

  return (
    <>
      <div className={styles.driver_page}>
        <Container className={styles.driver_page}>
          <Col style={{ margin: "0px" }}>
            <Row className={styles.my_row}>
              <div className={styles.driver_page}>
                <Col className={styles.btn_col}>
                  <button className={styles.my_btn} onClick={backToDriverTree}>
                    Back to Driver Tree
                  </button>
                  <br />
                  <button
                    className={styles.my_btn}
                    onClick={() => setShowMod(true)}
                  >
                    Generate PDF
                  </button>
                  {selDriver.embeddedOutcomeId === 0 ? (
                    <button
                      className={styles.my_btn}
                      onClick={createEmbeddedDriverTree}
                    >
                      Embed A Driver Tree
                    </button>
                  ) : null}
                  <Form.Group>
                    <Col>
                      <Row style={{ fontSize: "15px" }}>
                        <Form.Label className={styles.status_label}>
                          Modified
                        </Form.Label>
                        <Form.Control
                          as="select"
                          id="status"
                          value={selDriver.modified}
                          //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                          name="modified"
                          onChange={handleInputChange}
                          onBlur={handleFormSubmit}
                          style={{
                            width: "100px",
                            fontSize: "15px",
                            height: "30px",
                          }}
                        >
                          <option key={1} value={"Yes"}>
                            Yes
                          </option>
                          <option key={2} value={"No"}>
                            No
                          </option>
                        </Form.Control>
                      </Row>
                    </Col>
                  </Form.Group>
                </Col>
              </div>
              {generateQuad(selDriver)}
            </Row>
            {loading ? (
              <Row style={{ height: "250px" }}>
                <DriverTable
                  outcomeId={outcomeId}
                  selDrivers={selDrivers}
                  setSelDrivers={setSelDrivers}
                  selDriver={selDriver}
                  setSelDriver={setSelDriver}
                  selOutcome={selOutcome}
                  setSelOutcome={setSelOutcome}
                />
              </Row>
            ) : null}

            {allquads ? (
              <Row id="all-quads" className="all-quads">
                {generateAllQuads(selDrivers)}
              </Row>
            ) : null}
          </Col>
        </Container>
      </div>

      <Modal
        name="pdfModal"
        show={showModal}
        size="md"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setShowMod(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="pdf-modal">PDF Selection</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.my_modal}>
          <Button
            variant="secondary"
            style={{ margin: "20px" }}
            onClick={exportPDFWithMethod}
          >
            This Driver
          </Button>
          <Button
            variant="secondary"
            style={{ margin: "20px" }}
            onClick={() => writePDF()}
          >
            All Drivers
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DriverPage;
