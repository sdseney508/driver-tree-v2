import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import styles from "./DriverNavbar.module.css";
import { useNavigate, useLocation } from "react-router";
import { loggedIn, getToken, getUser, logout } from "../utils/auth";
import { outcomeByCommand } from "../utils/drivers";

const DriverNavbar = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  let pName = location.pathname.slice(0, 5);
  const [navState, setNavState] = useState({});

  const allOutcomes = async (userInfo) => {
    try {
      const token = loggedIn() ? getToken() : null;
      if (!token) {
        navigate("/");
        return;
      }
      const response = await getUser(token);
      if (!response.data) {
        navigate("/");
        throw new Error("something went wrong!");
      }
      const user = response.data;
      let userDataLength = Object.keys(user).length;
      //if the user isnt logged in with an unexpired token, send them to the login page
      if (!userDataLength > 0) {
        navigate("/");
      } else {
        let toutcomeID;
        await outcomeByCommand(user.stakeholderId).then((data) => {
          if (data) {
            toutcomeID = data.data[0].id;
          } else {
            toutcomeID = 0;
          }
        });
        navigate("/allOutcomes/" + toutcomeID);
      }
    } catch (err) {
      console.error(err);
      navigate("/");
    }
  };

  const goHome = () => {
    navigate("/user");
  };

  const gotoDriverTree = async () => {
    try {
      const token = loggedIn() ? getToken() : null;
      if (!token) {
        navigate("/");
        return;
      }
      const response = await getUser(token);
      if (!response.data) {
        navigate("/");
        throw new Error("something went wrong!");
      }
      const user = response.data;
      let userDataLength = Object.keys(user).length;
      //if the user isnt logged in with an unexpired token, send them to the login page
      if (!userDataLength > 0) {
        navigate("/");
      } else {
        let toutcomeID;
        await outcomeByCommand(user.stakeholderId).then((data) => {
          if (data.data.length > 0) {
            toutcomeID = data.data[0].id;
          } else {
            toutcomeID = 0;
          }
        });
        navigate("/driverTree/" + toutcomeID);
      }
    } catch (err) {
      console.error(err);
      navigate("/");
    }
  };

  const adminAccountManage = () => {
    navigate("/adminaccountmanage");
  };

  const databaseManagement = () => {
    // 👇️ navigate to database management.  this is where the administrator can add, remove, and update teams, functional areas, and systems.
    navigate("/admindatabasemanage");
  };

  return (
    <>
      {/* nested terniary.  First one checks if you are on the welcome screen, second one checks if you are on any of the admin pages.  This could also be modified to check if you are an admin and send you there */}
      {!loading ? (
        location.pathname !== "/" ? (
          pName !== "/admi" ? (
            <Navbar className={styles.navbar_custom} variant="dark">
              <Container>
                <Navbar.Toggle />

                <Nav>
                  <Nav.Link onClick={goHome} className={styles.nav_link}>
                    Home Page
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => allOutcomes(navState)}
                    className={styles.nav_link}
                  >
                    Outcomes
                  </Nav.Link>
                  <Nav.Link
                    onClick={gotoDriverTree}
                    className={styles.nav_link}
                  >
                    Driver Trees
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/accountmanage"
                    className="navbar-custom"
                  >
                    Account Mngmt
                  </Nav.Link>
                  <Nav.Link href="/assets/UserGuide.pdf" target="_blank" className={styles.nav_link}>
                    User Guide
                  </Nav.Link>
                  <Nav.Link onClick={logout} className={styles.nav_link}>
                    Logout
                  </Nav.Link>
                </Nav>
                <h5 className={styles.copyright}>
                  {" "}
                  &copy; Integrated Program Solutions, Inc
                </h5>
              </Container>
            </Navbar>
          ) : (
            <Navbar className={styles.navbar_custom} variant="dark">
              <Container fluid>
                <Navbar.Toggle />
                <Navbar.Collapse id="navbar" className="navbar-custom">
                  <Nav>
                    <Nav.Link as={Link} to="/admin" className="navbar-custom">
                      Admin Home Page
                    </Nav.Link>
                    <Nav.Link
                      onClick={gotoDriverTree}
                      className="navbar-custom"
                    >
                      Admin Drivers Page
                    </Nav.Link>
                    <Nav.Link
                      onClick={adminAccountManage}
                      className="navbar-custom"
                    >
                      Admin Account Mngmt
                    </Nav.Link>
                    <Nav.Link
                      onClick={databaseManagement}
                      className="navbar-custom"
                    >
                      Database Mngmt
                    </Nav.Link>
                    <Nav.Link onClick={logout} className={styles.nav_link}>
                      Logout
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          )
        ) : (
          ""
        )
      ) : location.pathname !== "/" ? null : (
        "Server delay, please refresh this page"
      )}

      <Modal
        name="helpModal"
        show={helpModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setHelpModal(false)}
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <iframe
          src="../../public/assets/UserGuide.pdf"
          title="User Guide"
          style={{ width: "100%", height: "80vh" }}
        >hi</iframe>
      </Modal>
    </>
  );
};

export default DriverNavbar;
