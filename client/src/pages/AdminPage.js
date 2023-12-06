//page for viewing and updating op limits
import React, { useState, useContext, useEffect, setState } from "react";
import { getUser, loggedIn, getToken } from "../utils/auth";
import { stateContext } from "../App";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";
import Contact from "../components/Contact";

const AdminPage = () => {
  const [showcontactModal, setcontactModal] = useState(false);
  const [state, setState] = useContext(stateContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = loggedIn() ? getToken() : null;
        if (!token) {
          navigate('/');
        }
        const response = await getUser(token);
        if (!response.data) {
          navigate('/');
          throw new Error('something went wrong!');
        }
        const user = response.data
        console.log(user);
        setState({...state, 
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userId: user.id,
          userRole: user.userRole,
        });       
        let userDataLength = Object.keys(user).length;
        //if the user isnt logged in with an unexpired token, send them to the login page
        if (!userDataLength>0 || user.userRole !== "Administrator") {
          navigate('/');
        }

      } catch (err) {
        console.error(err);
      }
    };
    getUserData();
  }, []);

  const onModalSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };

  const handleClose = () => {
    setcontactModal(false);
  };

  const outcomesManagement = () => {
    // 👇️ navigate to outcomes management page.  this is where the administrator can add, remove, and update op limits.
    alert("This feature is disabled for demo.");
  };

  const driverManagement = () => {
    // 👇️ navigate to driver management page.  this is where the administrator can add, remove, and update op limits.
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
