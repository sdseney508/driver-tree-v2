//page for viewing and updating op limits
import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { getUserData } from "../utils/auth";
import DriverTable from "../components/DriversTable";
import "./DriverTreePage.module.css";

const AdminDriversPage = () => {
  const [userData, setUserData] = useState({});
  const [state, setState] = useState([]);
  const [selDrivers, setSelDrivers] = useState([]);
  const [selDriver, setSelDriver] = useState({});
  const [selOutcome, setSelOutcome] = useState({});

  //initializing the state variables

  let navigate = useNavigate();

  //using the initial useEffect hook to open up the draft oplimits and prefill the form
  useEffect(() => {
    getUserData({navigate, state, setState});
    if (state.Role !== "Administrator") {
      alert("You are not authorized to view this page.");
      navigate("/user");
    }
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
