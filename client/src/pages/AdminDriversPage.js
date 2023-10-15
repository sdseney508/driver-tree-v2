//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import { stateContext } from "../App";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import {

} from "../utils/drivers";
import { useNavigate } from "react-router";
import { getUser, loggedIn, getToken } from "../utils/auth";
import { allDrivers } from "../utils/drivers";
import DriversTable from "../components/DriversTable";
import "./DriverTreePage.module.css";

const AdminDriversPage = () => {
  const [state, setState] = useContext(stateContext);
  const [userData, setUserData] = useState({});
  const [selOpLimit, setSelOpLimit] = useState([]);
  const [sigSet, setSigSet] = useState({});
  const [typeState, setTypeState] = useState([]);
  const [aircraftState, setAircraftState] = useState([]);
  const [systemState, setSystemState] = useState([]);
  const [configurationState, setConfigurationState] = useState([]);
  const [functionalState, setFunctionalState] = useState([]);
  //using the global state variable to store the selected opLimit
  //using quite a few state variables here.  I'm not sure if this is the best way to do this, but it works.
  const [coordState, setCoordState] = useState([]);
  const [gftdState, setGftdState] = useState([]);
  const [apmseState, setApmseState] = useState([]);
  const [smeState, setSmeState] = useState([]);
  const [selectedCoord, setSelectedCoord] = useState(1);
  const [selectedGftd, setSelectedGftd] = useState(1);
  const [selectedApmse, setSelectedApmse] = useState(1);
  const [selectedSme1, setSelectedSme1] = useState(1);
  const [selectedSme2, setSelectedSme2] = useState(1);
  const [selectedSme3, setSelectedSme3] = useState(1);
  const [selectedSme4, setSelectedSme4] = useState(1);
  const [selectedvCheng, setSelectedvCheng] = useState(1);
  const [selectedvtd, setSelectedvtd] = useState(1);
  const [selectedvcoord, setSelectedvcoord] = useState(1);
  const [selectedv1, setSelectedv1] = useState(1);
  const [selectedv2, setSelectedv2] = useState(1);
  const [selectedv3, setSelectedv3] = useState(1);
  const [selectedv4, setSelectedv4] = useState(1);
  const [selectedType, setSelectedType] = useState("Select a Limit Type");
  const [selectedAircraft, setSelectedAircraft] = useState("T-1");
  const [selectedSystem, setSelectedSystem] = useState("Flight Controls");
  const [selectedConfiguration, setSelectedConfiguration] = useState(
    "Select a Configuration"
  );
  const [selectedFunctionalArea, setSelectedFunctionalArea] = useState(
    "Select a Functional Area");
  const [recordLockState, setRecordLockState] = useState(false);
  const [dateState, setDateState] = useState(false);

//initializing the state variables
  let limitType;
  let ltypes;
  let aircrafttypes;
  let systems;
  let configurations;
  let id;
  let functionals;
  let sme;
  let gftd;
  let apmse;
  let coord;

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
          navigate("/")
          throw new Error("something went wrong!");
        }
        const user = response.data;
        setUserData(user);
        setState({
          firstName: user.firstName,
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

    getUserData();
    //this one gets the initial draftOL for the form
  }, []);

  // useEffect(() => {
  //   const getEverything = async(limit) => {
  //   //updates the selected fields for the most recent info
  //   await getSigSets(limit.id).then((data) => {
  //     setselecteds(data.data);
  //   });
  //   setSelectedAircraft(limit.olaircraft);
  //   setSelectedType(limit.limitType);
  //   setSelectedSystem(limit.olSystem);
  //   setSelectedConfiguration(limit.olconfiguration0);
  //   setSelectedFunctionalArea(limit.functionalArea);
  // };
  //   getEverything(selOpLimit);
  // }, [selOpLimit]);

  // async function getData() {
  //   await allDrivers().then((data) => {
  //     id = data.data[0].id;
  //     setSelOpLimit(data.data[0]);
  //   });

  //   await getSigSets(id).then((data) => {
  //     setSigSet(data.data);
  //     setselecteds(data.data);
  //   });

  //   //get all the data for the GUI boxes.  These functions are all in /utils/limits.js
  //   await getSigData();
  //   await getTypeData();
  //   await getFunctionalData();
  //   await getAircraftData();
  //   await getSystemData();
  //   await getConfigurationData();
  // }

  //TODO:  Move this as a function in /utils so i can call it on all the forms and not have to worry about repeating code
  // async function setselecteds(data) {
  //   if (data.coord) {
  //     setSelectedCoord(data.coord);
  //   } else {
  //     setSelectedCoord(0);
  //   }
  //   if (data.gftd) {
  //     setSelectedGftd(data.gftd);
  //   } else {
  //     setSelectedGftd(0);
  //   }
  //   if (data.cd) {
  //     setSelectedApmse(data.cd);
  //   } else {
  //     setSelectedApmse(0);
  //   }
  //   if (data.sme1) {
  //     setSelectedSme1(data.sme1);
  //   } else {
  //     setSelectedSme1(0);
  //   }
  //   if (data.sme2) {
  //     setSelectedSme2(data.sme2);
  //   } else {
  //     setSelectedSme2(0);
  //   }
  //   if (data.sme3) {
  //     setSelectedSme3(data.sme3);
  //   } else {
  //     setSelectedSme3(0);
  //   }
  //   if (data.sme4) {
  //     setSelectedSme4(data.sme4);
  //   } else {
  //     setSelectedSme4(0);
  //   }
  //   if (data.vcheng) {
  //     setSelectedvCheng(data.vcheng);
  //   } else {
  //     setSelectedvCheng(0);
  //   }
  //   if (data.vtd) {
  //     setSelectedvtd(data.vtd);
  //   } else {
  //     setSelectedvtd(0);
  //   }
  //   if (data.vcoord) {
  //     setSelectedvcoord(data.vcoord);
  //   } else {
  //     setSelectedvcoord(0);
  //   }
  //   if (data.v1) {
  //     setSelectedv1(data.v1);
  //   } else {
  //     setSelectedv1(0);
  //   }
  //   if (data.v2) {
  //     setSelectedv2(data.v2);
  //   } else {
  //     setSelectedv2(0);
  //   }
  //   if (data.v3) {
  //     setSelectedv3(data.v3);
  //   } else {
  //     setSelectedv3(0);
  //   }
  //   if (data.v4) {
  //     setSelectedv4(data.v4);
  //   } else {
  //     setSelectedv4(0);
  //   }
  // }

  return (
    <>
      <div className="op-limits-page">
        <Container>
         
        </Container>
      </div>
    </>
  );
};

export default AdminDriversPage;

