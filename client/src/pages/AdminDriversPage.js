//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import { stateContext } from "../App";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { getUser, loggedIn, getToken } from "../utils/auth";
import DriverTable from "../components/DriversTable";
import "./DriverTreePage.module.css";

const AdminDriversPage = () => {
  const [userData, setUserData] = useState({});
  const [state, setState] = useContext(stateContext);
  const [selDrivers, setSelDrivers] = useState([]);
  const [selDriver, setSelDriver] = useState({});
  const [selOutcome, setSelOutcome] = useState({});

  //initializing the state variables

  let navigate = useNavigate();

  //using the initial useEffect hook to open up the draft oplimits and prefill the form
  useEffect(() => {
    const getUserData = async () => {
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
        setUserData(user);
        setState({
          firstName: user.firstName,
          Role: user.userRole,
          userId: user.id,
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

    getUserData();
    //this one gets the initial draftOL for the form
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="op-limits-page">
        <Container>
          <Row style={{ height: "500px" }}>
            <DriverTable
              selDrivers={selDrivers}
              setSelDrivers={setSelDrivers}
              selDriver={selDriver}
              setSelDriver={setSelDriver}
              selOutcome={selOutcome}
              setSelOutcome={setSelOutcome}
            />
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AdminDriversPage;
