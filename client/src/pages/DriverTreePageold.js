import React, { useState, useContext, useEffect } from "react";
// import Select from "react-select";
import { stateContext } from "../App";
import { Container, Row, Col, Button, Card, Modal } from "react-bootstrap";
import {
  createOutcome,
  getOutcome,
  getDriverByOutcome,
  getStakeholders,
} from "../utils/drivers";
import { useNavigate, useLocation } from "react-router";
import { useParams } from "react-router";
import DriverCards from "../components/driverCards";
import Legend from "../components/legend";
import { getUser, loggedIn, getToken } from "../utils/auth";
import styles from "./DriverTreePage.module.css";
import OutcomeTable from "../components/OutcomeTable";
import ClusterModal from "../components/ClusterModal";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const DriverTreePage = () => {
  const [state, setState] = useContext(stateContext);
  const [showClusterModal, setClusterModal] = useState(false);
  const [selOutcome, setSelOutcome] = useState({});
  const [selDrivers, setSelDrivers] = useState([]);
  const [selDriver, setSelDriver] = useState({});
  const [driverTreeObj, setDriverTreeObj] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);

  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value

  let location = useLocation();
  let navigate = useNavigate();

  //grabs the outcomeID from the URL; allows someone to email someone a direct link to a specific driver tree.
  //TODO:  Make it so that this pops an error if someone doesnt have access to that specific Outcome's Driver Tree
  let { outcomeID } = useParams();

  let tierOne = {
    tier: 1,
  };

  let tierTwo = {
    tier: 2,
  };

  let tierThree = {
    tier: 3,
  };

  let tierFour = {
    tier: 4,
  };

  let tierFive = {
    tier: 5,
  };

  //using the initial useEffect hook to open up the driver trees and prefill the table at the bottom of the page
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
      if (!outcomeID) {
        outcomeID = 1;
      }
      await getOutcome(outcomeID).then((data) => {
        setSelOutcome(data.data);
      });
    };
    //TODO: update to use useParams and put the outcomeID and driverID in the URL
    const getDriversData = async (outcomeID) => {
      await getDriverByOutcome(outcomeID).then((data) => {
        setDriverTreeObj(data.data);
      });
    };

    // const getStakeholderData = async (outcomeID) => {
    //   await getStakeholders(outcomeID).then((data) => {
    //     console.log(data.data);
    //     setStakeholders(data.data);
    //   });
    // };

    getUserData();
    getOutcomeData();
    getDriversData();
    // getStakeholderData();
    setState({ ...state, selOutcome: selOutcome });
    //this one gets the initial draftOL for the form
  }, []);

  //this useeffect is there to refresh the driver tree elements whenever the selOutcome state is changed.
  useEffect(() => {
    let dtree;
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
    navigate("/drivertree/" + selOutcome.id);
  }, [selOutcome]);

  //creates new outcome and then resets the selOutcome state.  This cause a a useEffect fire and refreshes the page.
  const newOutcome = () => {
    createOutcome().then((data) => {
      setSelOutcome(data.data);
    });
  };

  const goToOutcome = async (e) => {
    navigate("/allOutcomes/" + selOutcome.id);
  };

  const onModalSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };

  //close the modal
  const handleClose = () => {
    setClusterModal(false);
  };

  return (
    <>
      <div className={styles.driver_page} id="driver_parent" key="topleveldiv">
        <Container fluid className="justify-content-center">
          <Col className={styles.my_col}>
            <Row
              className="justify-content-center m-1"
              styles={{ height: "75px" }}
            >
              <Button
                className={styles.my_btn}
                style={{ width: "150px", height: "30px", margin: "10px" }}
                onClick={newOutcome}
              >
                New Outcome
              </Button>
              <Button
                className={styles.my_btn}
                onClick={() => setClusterModal(true)}
                style={{ width: "150px", height: "30px", margin: "10px" }}
              >
                Create Cluster
              </Button>
            </Row>

            <div></div>

            <Row className={styles.outcome}>
              <Col className={styles.driver} sm={6} md={6} lg={2} key="0">
                <p>Tier 0</p>
                <Row
                  style={{
                    height: "800px",
                    width: "100%",
                  }}
                  className="m-1"
                  id="outcomeColumn"
                  key="outcomeColumn1"
                >
                  <Card className={styles.my_card} onClick={goToOutcome}>
                    <Card.Header className={styles.card_header}></Card.Header>
                    <Card.Body className={styles.my_card_body}>
                      <Card.Text className={styles.my_card_text}>
                        {selOutcome.outcomeTitle}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className={styles.card_footer}></Card.Footer>
                  </Card>
                  <Row style={{ height: "700px" }}>
                    <Legend driverTreeObj={driverTreeObj} />
                  </Row>
                </Row>
              </Col>

              <DriverCards
                tier={tierOne}
                driverTreeObj={driverTreeObj}
                selOutcome={selOutcome}
                selDriver={selDriver}
                setSelOutcome={setSelOutcome}
              />
              <DriverCards
                tier={tierTwo}
                driverTreeObj={driverTreeObj}
                selOutcome={selOutcome}
                selDriver={selDriver}
                setSelOutcome={setSelOutcome}
              />

              <DriverCards
                tier={tierThree}
                driverTreeObj={driverTreeObj}
                selOutcome={selOutcome}
                selDriver={selDriver}
                setSelOutcome={setSelOutcome}
              />

              <DriverCards
                tier={tierFour}
                driverTreeObj={driverTreeObj}
                selOutcome={selOutcome}
                selDriver={selDriver}
                setSelOutcome={setSelOutcome}
              />

              <DriverCards
                tier={tierFive}
                driverTreeObj={driverTreeObj}
                selOutcome={selOutcome}
                selDriver={selDriver}
                setSelOutcome={setSelOutcome}
              />

              {/* <Col
                className="justify-content-center driver"
                sm={10}
                md={3}
                id="legend"
                key="legendColumn"
              >
                <Row style={{ height: "700px" }}>
                  <Legend stakeholders={selOutcome.legend} />
                </Row>
              </Col> */}
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

      <Modal
        name="clusterModal"
        show={showClusterModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setClusterModal(false)}
        // className={styles.cluster_modal}
      >
        <Modal.Header closeButton>
          <Modal.Title id="cluster-modal">Create Cluster</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*change everything in the signup form components*/}
          <ClusterModal
            onModalSubmit={onModalSubmit}
            selDriver={selDriver}
            setSelDriver={setSelDriver}
            selOutcome={selOutcome}
            setSelOutcome={setSelOutcome}
            driverTreeObj={driverTreeObj}
          />
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DriverTreePage;