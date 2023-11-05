//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows"; //for the arrows
import { stateContext } from "../App";
import { Container, Row, Col, Button, Card, Modal } from "react-bootstrap";
import {
  createOutcome,
  getOutcome,
  getDriverByOutcome,
} from "../utils/drivers";
import { getArrows } from "../utils/arrows";
import { useNavigate, useLocation } from "react-router";
import { useParams } from "react-router"; //to store state in the URL
import DriverCards from "../components/driverCards";
import Legend from "../components/legend";
import { getUser, loggedIn, getToken } from "../utils/auth";
import styles from "./DriverTreePage.module.css";
import OutcomeTable from "../components/OutcomeTable";
import ClusterModal from "../components/ClusterModal";
import ArrowModal from "../components/ArrowModal";
import DriverArrows from "../components/DrawArrows";
import ModArrows from "../components/ModArrows";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const DriverTreePage = () => {
  const [state, setState] = useContext(stateContext);
  const [arrows, setArrows] = useState([]);
  const [arrowID, setArrowID] = useState();
  const [showClusterModal, setClusterModal] = useState(false);
  const [showArrowModal, setArrowModal] = useState(false);
  const [showArrowMod, setArrowMod] = useState(false);
  const [selOutcome, setSelOutcome] = useState({});
  const [selDrivers, setSelDrivers] = useState([]);
  const [selDriver, setSelDriver] = useState({});
  const [driverTreeObj, setDriverTreeObj] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);

  const { outcomeID } = useParams();

  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value

  let location = useLocation();
  let navigate = useNavigate();

  //grabs the outcomeID from the URL; allows someone to email someone a direct link to a specific driver tree.
  //TODO:  Make it so that this pops an error if someone doesnt have access to that specific Outcome's Driver Tree

  // let tierOne = {
  //   tier: 1,
  // };

  // let tierTwo = {
  //   tier: 2,
  // };

  // let tierThree = {
  //   tier: 3,
  // };

  // let tierFour = {
  //   tier: 4,
  // };

  // let tierFive = {
  //   tier: 5,
  // };

  //using the initial useEffect hook to open up the driver trees and prefill the table at the bottom of the page
  useEffect(() => {
    const getUserData = async () => {
      //this first part just ensures they whoever is on this page is an authenticated user; prevents someone from typing in the url and gaining access
      try {
        //these comes from the utils section of the code
        //TODO:  not working for the useParams pages, change the below to an isExpired check of the token.
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
      //TODO:
      //in here for error handling only; this needs to be updated and removed
      if (!outcomeID) {
        outcomeID = 1;
      }
      await getOutcome(outcomeID).then((data) => {
        setSelOutcome(data.data);
      });
    };
    const getDriversData = async () => {
      await getDriverByOutcome(outcomeID).then((data) => {
        setDriverTreeObj(data.data);
      });
    };

    const getArrowsData = async () => {
      await getArrows(outcomeID).then((data) => {
        setArrows(data.data);
      });
    };
    getUserData();
    getOutcomeData();
    getDriversData();
    getArrowsData();
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
      });
    };
    const getArrowsData = async () => {
      await getArrows(outcomeID).then((data) => {
        setArrows(data.data);
      });
    };

    getDriversData();
    getArrowsData();
    setState({ ...state, selOutcome: selOutcome });

    navigate("/drivertree/" + selOutcome.id);
  }, [selOutcome]);

  //creates new outcome and then resets the selOutcome state.  This cause a a useEffect fire and refreshes the page.
  const newOutcome = () => {
    createOutcome().then((data) => {
      setSelOutcome(data.data);
    });
  };

  //navigate to the outcome page
  const goToOutcome = async (e) => {
    navigate("/allOutcomes/" + selOutcome.id);
  };

  //used to handle the submit of the modals for clusters and arrows
  const onModalSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };

  //close the modal
  const handleClose = () => {
    setClusterModal(false);
    setArrowModal(false);
  };

  const myArrow = (array) => {
    return array.map((f, index) => {
      return (<div>
        <Xarrow
          start={array[index].start}
          color={array[index].color}
          end={array[index].end}
          path={array[index].path}
          startAnchor={array[index].startAnchor}
          endAnchor={array[index].endAnchor}
          strokeWidth={array[index].strokeWidth}
          headSize={array[index].headSize}
          gridBreak={array[index].gridBreak}
          showTail={array[index].showTail}
          showHead={array[index].showHead}
          dashness={array[index].dashness}
          arrowBodyProps={array[index].arrowBodyProps}
          passProps={array[index].arrowBodyProps}
          id={array[index].id}
        />
      </div>)
  });
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

              <Button
                className={styles.my_btn}
                onClick={() => setArrowModal(true)}
                style={{ width: "150px", height: "30px", margin: "10px" }}
              >
                Create Arrow
              </Button>
            </Row>

            <Row className={styles.outcome}>
              {/* <Col className={styles.driver} key="0">
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
                  <Card className={styles.my_card} onClick={goToOutcome} id={`outcomeID${selOutcome.id}`}>
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
              </Col> */}

              <DriverCards
                driverTreeObj={driverTreeObj}
                selOutcome={selOutcome}
                selDriver={selDriver}
                setSelOutcome={setSelOutcome}
                arrows={arrows}
                showArrowMod={showArrowMod}
                setArrowMod={setArrowMod}
                arrowID={arrowID}
                setArrowID={setArrowID}
              />
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

      <Modal
        name="arrowModal"
        show={showArrowModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setArrowModal(false)}
        // className={styles.cluster_modal}
      >
        <Modal.Header closeButton>
          <Modal.Title id="cluster-modal">Create Arrow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*change everything in the signup form components*/}
          <ArrowModal
            onModalSubmit={onModalSubmit}
            selDriver={selDriver}
            setSelDriver={setSelDriver}
            selOutcome={selOutcome}
            setSelOutcome={setSelOutcome}
          />
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Body>
      </Modal>

      <Modal
        name="arrowModModal"
        show={showArrowMod}
        size="lg"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setArrowMod(false)}
        // className={styles.cluster_modal}
      >
        <Modal.Header closeButton>
          <Modal.Title id="cluster-modal">Mod Arrow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*change everything in the signup form components*/}
          <ModArrows
            onModalSubmit={onModalSubmit}
            arrowID={arrowID}
            setArrowMod={setArrowMod}
            selOutcome={selOutcome}
            setSelOutcome={setSelOutcome}
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
