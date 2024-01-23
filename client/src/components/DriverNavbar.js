import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import styles from "./DriverNavbar.module.css";
import { useNavigate, useLocation } from "react-router";
import { loggedIn, getToken, getUser } from "../utils/auth";
import { outcomeByCommand} from "../utils/drivers"

const DriverNavbar = () => {
  let location = useLocation();
  let navigate = useNavigate();
  let pName = location.pathname.slice(0, 5);
  const [navState, setNavState] = useState({});

  useEffect(() => {
    const getUserData = async (navigate,setNavState) => {
      try {
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
        setNavState({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userId: user.id,
          userRole: user.userRole,
          command: user.stakeholderId,
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

    getUserData(navigate,setNavState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const allOutcomes = async () => {
    let toutcomeID;
    await outcomeByCommand(navState.command).then((data) => {
        toutcomeID=data.data[0].id;
    });

    navigate("/allOutcomes/"+toutcomeID);
  };

  const goHome = () => {
    navigate("/user");
  };

  const gotoDriverTree = async () => {
    let toutcomeID;
    await outcomeByCommand(navState.command).then((data) => {
        toutcomeID=data.data[0].id;
    });
    console.log(toutcomeID);
    navigate("/driverTree/" + toutcomeID);
  };

  const adminAccountManage = () => {
    navigate("/adminaccountmanage");
  };

  const adminDrivers = async () => {
    let toutcomeID;
    await outcomeByCommand(navState.command).then((data) => {
        toutcomeID=data.data[0].id;
    });
    console.log(toutcomeID);
    navigate("/driverTree/" + toutcomeID);
  };

  const databaseManagement = () => {
    // 👇️ navigate to database management.  this is where the administrator can add, remove, and update teams, functional areas, and systems.
    navigate("/admindatabasemanage");
  };

  //TODO:  bonus feature to be done later, pre-filter drivers by user
  // const myLimits = () => {
  //   navigate("/mydrivers", { state: { driverType: "My" } });
  // };

  return (
    <>
      {/* nested terniary.  First one checks if you are on the welcome screen, second one checks if you are on any of the admin pages.  This could also be modified to check if you are an admin and send you there */}
      {navState.userId ? location.pathname !== "/" ? (
        pName !== "/admi" ? (
          <Navbar className={styles.navbar_custom} variant="dark">
            <Container>
              <Navbar.Toggle />

              <Nav>
                <Nav.Link onClick={goHome} className={styles.nav_link}>
                  Home Page
                </Nav.Link>
                <Nav.Link onClick={allOutcomes} className={styles.nav_link}>
                  Outcomes
                </Nav.Link>
                <Nav.Link onClick={gotoDriverTree} className={styles.nav_link}>
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
              <h5 className={styles.copyright}> &copy; Integrated Program Solutions, Inc</h5>
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
{/* 
                  <Nav.Link
                    as={Link}
                    to="/admincarouselmanage"
                    className="navbar-custom"
                  >
                    Carousel Mngmt
                  </Nav.Link> */}
                </Nav>
              </Navbar.Collapse>
            </Container>
            <p className={styles.copyright}>&#169; Integrated Program Solutions, Inc</p>
          </Navbar>
        )
      ) : (
        ""
      ): "Loading..."}
    </>
  );
};

export default DriverNavbar;
