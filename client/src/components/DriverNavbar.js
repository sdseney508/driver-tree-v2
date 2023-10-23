import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { stateContext } from "../App";
import { Navbar, Nav, Container } from "react-bootstrap";
import styles from "./DriverNavbar.module.css";
import { useNavigate, useLocation } from "react-router";
// import Typewriter from "../components/Typewriter";

const DriverNavbar = () => {
  let location = useLocation();
  let navigate = useNavigate();

  // console.log("location state is: ", locstate);
  const [state, setState] = useContext(stateContext);

  let pName = location.pathname.slice(0, 6);
  const allOutcomes = () => {
    navigate("/allOutcomes", { state: { driverState: "All" } });
  };

  const adminAccountManage = () => {
    navigate("/adminaccountmanage");
  };

  const adminDrivers = () => {
    navigate("/admindrivermanage");
  };

  const databaseManagement = () => {
    // 👇️ navigate to database management.  this is where the administrator can add, remove, and update teams, functional areas, and systems.
    navigate("/admindatabasemanage", { state });
  };

  //TODO:  bonus feature to be done later, pre-filter drivers by user
  // const myLimits = () => {
  //   navigate("/mydrivers", { state: { driverType: "My" } });
  // };

  return (
    <>
      {/* nested terniary.  First one checks if you are on the welcome screen, second one checks if you are on any of the admin pages.  This could also be modified to check if you are an admin and send you there */}
      {location.pathname !== "/" ? (
        pName !== "/admin" ? (
          <Navbar className={styles.navbar_custom} variant="dark">
            <Container>
              <Navbar.Toggle />

              <Nav>
                <Nav.Link as={Link} to="/user" className={styles.nav_link}>
                  Home Page
                </Nav.Link>
                <Nav.Link onClick={allOutcomes} className={styles.nav_link}>
                  Outcomes
                </Nav.Link>
                <Nav.Link as={Link} to="/drivertree" className={styles.nav_link}>
                  Driver Trees
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/accountmanage"
                  className="navbar-custom"
                >
                  Account Mngmt
                </Nav.Link>
              </Nav>  
              {/* <Typewriter /> */}
            </Container>
          </Navbar>
        ) : (
          <Navbar className="navbar-custom" variant="dark">
            <Container fluid>
              <Navbar.Toggle />
              <Navbar.Collapse id="navbar" className="navbar-custom">
                <Nav>
                  <Nav.Link as={Link} to="/admin" className="navbar-custom">
                    Admin Home Page
                  </Nav.Link>
                  <Nav.Link onClick={adminDrivers} className="navbar-custom">
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

                  <Nav.Link
                    as={Link}
                    to="/admincarouselmanage"
                    className="navbar-custom"
                  >
                    Carousel Mngmt
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        )
      ) : (
        ""
      )}
    </>
  );
};

export default DriverNavbar;
