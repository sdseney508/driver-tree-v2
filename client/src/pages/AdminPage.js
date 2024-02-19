//page for viewing and updating drivers
import React, { useState,  useEffect } from "react";
import { getAdminUserData } from "../utils/auth";
import { getUsers} from "../utils/drivers";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminPage.css";
import Contact from "../components/Contact";

const AdminPage = () => {
  const [showcontactModal, setcontactModal] = useState(false);
  const [state, setState] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const pName = location.pathname;

  useEffect( () => {
    getAdminUserData({navigate, state, setState, pName});
    fetchData();

  }, []);

  async function fetchData () {
    let users = await getUsers().then((data) => {
        return data.data;
    });
    let newUserCheck = 'false'
    for (let i = 0; i < users.length; i++) {
      if (users[i].userStatus === "Requested") {
        newUserCheck = 'true';
      }
    }
    if (newUserCheck === 'true') {
      alert("There are new users to be approved.");
    }
    
  };

  const onModalSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };

  const handleClose = () => {
    setcontactModal(false);
  };

  const outcomesManagement = () => {
    // 👇️ navigate to outcomes management page.  this is where the administrator can add, remove, and update drivers.
    alert("This feature is disabled for demo.");
  };

  const driverManagement = () => {
    // 👇️ navigate to driver management page.  this is where the administrator can add, remove, and update drivers.
    alert("This feature is disabled for demo.");
  };

  const accountManagement = () => {
    // 👇️ navigate to account management page.  this is where the administrator can add, remove, and update users.
    navigate("/adminaccountmanage", {state});
  };


  const databaseManagement = () => {
    // 👇️ navigate to database management.  this is where the administrator can add, remove, and update teams, functional areas, and systems.
    navigate("/admindatabasemanage", {state});
  };

  return (
    <>  
      
      <Container>
        <div
        style={{height: "100vh"}}
        className="admin-page"
        >
          <Row className="justify-content-center rowstyle">
            <h1 className="text-center">Administrator's Page</h1>
            <p className="text-center">Welcome {state.firstName}.</p>
            <Col sm={10} md={8} lg={6} className="justify-content-center">
              <Row className="justify-content-center">
                <Button
                  className="welcome-btn p-1 rounded-lg m-3"
                  id="createLimit"
                  variant="success"
                  onClick={outcomesManagement}
                >
                  Outcomes Management{" "}
                </Button>
              </Row>
              <Row className="justify-content-center">
                <Button
                  className="welcome-btn p-1 rounded-lg m-3"
                  id="createLimit"
                  variant="success"
                  onClick={driverManagement}
                >
                  Driver Management{" "}
                </Button>
              </Row>
              <Row className="justify-content-center">
                <Button
                  className="welcome-btn p-1 rounded-lg m-3"
                  id="reviewLimit"
                  variant="secondary"
                  onClick={accountManagement}
                >
                  Account Management{" "}
                </Button>
              </Row>

              <Row className="justify-content-center">
                <Button
                  className="welcome-btn p-1 rounded-lg m-3"
                  id="reviewLimit"
                  variant="secondary"
                  onClick={databaseManagement}
                >
                  Database Management{" "}
                </Button>
              </Row>
              <Row className="justify-content-center">
                <Button
                  className="welcome-btn p-1 rounded-lg m-3"
                  id="editDraftLimit"
                  variant="warning"
                  onClick={() => setcontactModal(true)}
                  >
                  Mass E-mail{" "}
                </Button>
              </Row>
              <Row className="justify-content-center"></Row>
      
            </Col>
          </Row>
        </div>
      </Container>

      <Modal
        name="contactModal"
        size="lg"
        show={showcontactModal}
        onHide={() => setcontactModal(false)}
        aria-labelledby="signup-modal"
        className="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="signup-modal" className="ms-auto">
            Mass E-mail
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*change everything in the signup form components*/}
          <Contact onModalSubmit={onModalSubmit}/>
        </Modal.Body>
      </Modal>


    </>
  );
};

export default AdminPage;
