//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import { stateContext } from "../App";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import {
  createOutcome,
  getOutcome,
  getDriverByOutcome,
} from "../utils/drivers";
import { getArrows } from "../utils/arrows";
import { useNavigate } from "react-router";
import { useParams } from "react-router"; //to store state in the URL
import DriverCards from "../components/driverCards";
import { getUser, loggedIn, getToken } from "../utils/auth";
import styles from "./DriverTreePage.module.css";
import OutcomeTable from "../components/OutcomeTable";
import ClusterModal from "../components/ClusterModal";
import ArrowModal from "../components/ArrowModal";
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
  const [selDriver, setSelDriver] = useState({});
  const [driverTreeObj, setDriverTreeObj] = useState([]);


  const { outcomeID } = useParams();

  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value

  let navigate = useNavigate();

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
        // eslint-disable-next-line no-const-assign, react-hooks/exhaustive-deps
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
    const getDriversData = async () => {
      await getDriverByOutcome(selOutcome.id).then((data) => {
        setDriverTreeObj(data.data);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selOutcome]);

  //creates new outcome and then resets the selOutcome state.  This cause a a useEffect fire and refreshes the page.
  const newOutcome = () => {
    createOutcome().then((data) => {
      setSelOutcome(data.data);
    });
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
    setArrowMod(false);
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
              <DriverCards
                driverTreeObj={driverTreeObj}
                selOutcome={selOutcome}
                setSelOutcome={setSelOutcome}
                arrows={arrows}
                setArrows={setArrows} 
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
      {/* for craeting a cluster */}
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

      {/* for creating new arrows */}
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
      {/* for modifying arrows */}
      <Modal
        name="arrowModModal"
        show={showArrowMod}
        size="md"
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
