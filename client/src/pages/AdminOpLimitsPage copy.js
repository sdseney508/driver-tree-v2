//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import { stateContext } from "../App";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import {
  getSigs,
  checkRev,
  createOL,
  createSigSet,
  deleteDraft,
  findUser,
  getOneOL,
  getTypes,
  getAircraft,
  getSystems,
  getConfigurations,
  createRevisedOL,
} from "../utils/limits";
import { useNavigate } from "react-router";
import { getUser, loggedIn, getToken } from "../utils/auth";
import { updateOL, getSigSets, updateSigSet, allOL } from "../utils/limits";
import OpLimitTable from "../components/OpLimitTable";
import "./NewOpLimitsPage.css";

const AdminOpLimitsPage = () => {
  const [state, setState] = useContext(stateContext);
  const [userData, setUserData] = useState({});
  const [selOpLimit, setSelOpLimit] = useState([]);
  const [sigSet, setSigSet] = useState({});
  const [typeState, setTypeState] = useState([]);
  const [aircraftState, setAircraftState] = useState([]);
  const [systemState, setSystemState] = useState([]);
  const [configurationState, setConfigurationState] = useState([]);
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
  const [recordLockState, setRecordLockState] = useState(false);
  const [dateState, setDateState] = useState(false);
  let limitType = state.limitType;

  let ltypes;
  let aircrafttypes;
  let systems;
  let configurations;
  let id;
  let navigate = useNavigate();

  //using the initial useEffect hook to open up the draft oplimits and prefill the form
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = loggedIn() ? getToken() : null;
        if (!token) {
          return false;
        }
        const response = await getUser(token);
        if (!response.data) {
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
    getData();
  }, []);

  useEffect(() => {
    //updates the selected fields for the most recent info
    getSigSets(selOpLimit.id).then((data) => {
      setselecteds(data.data);
    });
    setSelectedAircraft(selOpLimit.olaircraft);
    setSelectedType(selOpLimit.limitType);
    setSelectedSystem(selOpLimit.olSystem);
    setSelectedConfiguration(selOpLimit.olconfiguration);


  }, [selOpLimit, sigSet]);

  async function getData() {
    await allOL().then((data) => {
      id = data.data[0].id;
      setSelOpLimit(data.data[0]);
    });

    await getSigSets(id).then((data) => {
      setSigSet(data.data);
      setselecteds(data.data);
    });
    await getSigData();
    await getTypeData();
    await getAircraftData();
    await getSystemData();
    await getConfigurationData();
  }

  function setselecteds(data) {
    setSelectedCoord(data.coord);
    setSelectedGftd(data.gftd);
    setSelectedApmse(data.apmse);
    setSelectedSme1(data.sme1);
    setSelectedSme2(data.sme2);
    setSelectedSme3(data.sme3);
    setSelectedSme4(data.sme4);
    setSelectedvCheng(data.vCheng);
    setSelectedvtd(data.vtd);
    setSelectedvcoord(data.vcoord);
    setSelectedv1(data.v1);
    setSelectedv2(data.v2);
    setSelectedv3(data.v3);
    setSelectedv4(data.v4);
  }

  async function getSigData() {
    let roles = { user_role: "Coordinator" };
    let coord = await getSigs(roles).then((data) => {
      return data.data;
    });
    setCoordState(coord);

    roles = { user_role: "APMSE" };
    let apmse = await getSigs(roles).then((data) => {
      return data.data;
    });
    setApmseState(apmse);

    roles = { user_role: "GFTD" };
    const gftd = await getSigs(roles).then((data) => {
      return data.data;
    });
    setGftdState(gftd);
    roles = { user_role: "SME" };
    let sme = await getSigs(roles).then((data) => {
      return data.data;
    });
    setSmeState(sme);
  }

  async function getTypeData() {
    ltypes = await getTypes().then((data) => {
      return data.data;
    });
    setTypeState(ltypes);
  }

  async function getAircraftData() {
    aircrafttypes = await getAircraft().then((data) => {
      return data.data;
    });
    setAircraftState(aircrafttypes);
  }

  async function getSystemData() {
    systems = await getSystems().then((data) => {
      return data.data;
    });
    setSystemState(systems);
  }

  async function getConfigurationData() {
    configurations = await getConfigurations().then((data) => {
      return data.data;
    });
    setConfigurationState(configurations);
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let body = {
      [e.target.name]: e.target.value,
    };

    await updateOL(selOpLimit.id, body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    setSelOpLimit(getOneOL(selOpLimit.id));
  };

  const updateStatus = async (status, id) => {
    let body = {
      olstat: status,
    };
    await updateOL(id, body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    setSelOpLimit(getOneOL(id));
  };

  const handleInputChange = (e) => {
    setSelOpLimit({ ...selOpLimit, [e.target.name]: e.target.value });
  };

  const handleSigInput = async (e) => {
    setSigSet({ ...sigSet, [e.target.name]: e.target.value });
    id = selOpLimit.id;
    let name = await findUser(e.target.value).then((data) => {
      return data.data;
    });

    let username = name.firstName + " " + name.lastName;
    let wherecl = e.target.name + "name";
    let wherecl2 = e.target.name;
    let useid = name.id;
    e.target.selected = true;
    let body = { [wherecl]: username, [wherecl2]: useid };
    //update the data in the database
    await updateSigSet(id, body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    //refresh what will be displayed on the form
    setSigSet(getSigSets(id));
  };

  function handleAircraftSelectedChange(e) {
    e.preventDefault();
    setSelectedAircraft(e.target.value);
    handleFormSubmit(e);
  }
  function handleSelectedConfigurationChange(e) {
    e.preventDefault();
    setSelectedAircraft(e.target.value);
    handleFormSubmit(e);
  }
  function handleTypeSelectedChange(e) {
    e.preventDefault();
    setSelectedType(e.target.value);
    handleFormSubmit(e);
  }
  //dead code, but could be fixed if required
  const handleAircraftSubmit = async (e, aircraftname) => {
    setSelOpLimit({ ...selOpLimit, [e.target.name]: aircraftname });
    e.target.selected = true;
    let body = { [e.target.name]: aircraftname };
    //update the data in the database
    await updateOL(selOpLimit.id, body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    //refresh what will be displayed on the form
    await setSelOpLimit(getOneOL(selOpLimit.id));
  };
  function handleSelectedSystemChange(e) {
    e.preventDefault();
    setSelectedSystem(e.target.value);
    handleFormSubmit(e);
  }
  function systemSel() {
    return systemState.map((f, index) => {
      return (
        <option key={index} value={f.system}>
          {f.system}
        </option>
      );
    });
  }
  function aircraftSel() {
    return aircraftState.map((f, index) => {
      return (
        <option key={index} value={f.nickname}>
          {f.nickname}
        </option>
      );
    });
  }
  function configurationSel() {
    return configurationState.map((f, index) => {
      return (
        <option key={index} value={f.configuration}>
          {f.configuration}
        </option>
      );
    });
  }
  function typeSel() {
    return typeState.map((f, index) => {
      return (
        <option key={index} value={f.limitType}>
          {f.limitType}
        </option>
      );
    });
  }
  function handleCoordSelectedChange(e) {
    e.preventDefault();
    setSelectedCoord(e.target.value);
    handleSigInput(e);
  }
  function coordSig() {
    return coordState.map((f, index) => {
      return (
        <option key={index} value={f.id}>
          {f.firstName} {f.lastName}
        </option>
      );
    });
  }
  function handleApmseSelectedChange(e) {
    e.preventDefault();
    setSelectedApmse(e.target.value);
    handleSigInput(e);
  }
  function apmseSig() {
    return apmseState.map((f, index) => {
      return (
        <option key={index} value={f.id}>
          {f.firstName} {f.lastName}
        </option>
      );
    });
  }
  function handleGftdSelectedChange(e) {
    e.preventDefault();
    setSelectedGftd(e.target.value);
    handleSigInput(e);
  }
  function gftdSig() {
    return gftdState.map((f, index) => {
      return (
        <option key={index} value={f.id}>
          {f.firstName} {f.lastName}
        </option>
      );
    });
  }
  function handleSme1SelectedChange(e) {
    e.preventDefault();
    setSelectedSme1(e.target.value);
    handleSigInput(e);
  }
  function sme1Sig() {
    return smeState.map((f, index) => {
      return (
        <option value={f.id}>
          {f.firstName} {f.lastName} - {f.functional}
        </option>
      );
    });
  }
  function handleSme2SelectedChange(e) {
    e.preventDefault();
    setSelectedSme2(e.target.value);
    handleSigInput(e);
  }
  function sme2Sig() {
    return smeState.map((f, index) => {
      return (
        <option value={f.id}>
          {f.firstName} {f.lastName} - {f.functional}
        </option>
      );
    });
  }
  function handleSme3SelectedChange(e) {
    e.preventDefault();
    setSelectedSme1(e.target.value);
    handleSigInput(e);
  }
  function sme3Sig() {
    return smeState.map((f, index) => {
      return (
        <option value={f.id}>
          {f.firstName} {f.lastName} - {f.functional}
        </option>
      );
    });
  }
  function handleSme4SelectedChange(e) {
    e.preventDefault();
    setSelectedSme1(e.target.value);
    handleSigInput(e);
  }
  function sme4Sig() {
    return smeState.map((f, index) => {
      return (
        <option value={f.id}>
          {f.firstName} {f.lastName} - {f.functional}
        </option>
      );
    });
  }
  function handlevCoordSelectedChange(e) {
    e.preventDefault();
    setSelectedvcoord(e.target.value);
    handleSigInput(e);
  }
  function vcoordSig() {
    return coordState.map((f, index) => {
      return (
        <option key={index} value={f.id}>
          {f.firstName} {f.lastName}
        </option>
      );
    });
  }
  function handlevChengSelectedChange(e) {
    e.preventDefault();
    setSelectedvCheng(e.target.value);
    handleSigInput(e);
  }
  function vchengSig() {
    return apmseState.map((f, index) => {
      return (
        <option key={index} value={f.id}>
          {f.firstName} {f.lastName}
        </option>
      );
    });
  }
  function handlevtdSelectedChange(e) {
    e.preventDefault();
    setSelectedvtd(e.target.value);
    handleSigInput(e);
  }
  function vtdSig() {
    return gftdState.map((f, index) => {
      return (
        <option key={index} value={f.id}>
          {f.firstName} {f.lastName}
        </option>
      );
    });
  }
  function handlev1SelectedChange(e) {
    e.preventDefault();
    setSelectedv1(e.target.value);
    handleSigInput(e);
  }
  function v1Sig() {
    return smeState.map((f, index) => {
      return (
        <option value={f.id}>
          {f.firstName} {f.lastName} - {f.functional}
        </option>
      );
    });
  }
  function handlev2SelectedChange(e) {
    e.preventDefault();
    setSelectedv2(e.target.value);
    handleSigInput(e);
  }
  function v2Sig() {
    return smeState.map((f, index) => {
      return (
        <option value={f.id}>
          {f.firstName} {f.lastName} - {f.functional}
        </option>
      );
    });
  }
  function handlev3SelectedChange(e) {
    e.preventDefault();
    setSelectedv1(e.target.value);
    handleSigInput(e);
  }
  function v3Sig() {
    return smeState.map((f, index) => {
      return (
        <option value={f.id}>
          {f.firstName} {f.lastName} - {f.functional}
        </option>
      );
    });
  }
  function handlev4SelectedChange(e) {
    e.preventDefault();
    setSelectedv1(e.target.value);
    handleSigInput(e);
  }
  function v4Sig() {
    return smeState.map((f, index) => {
      return (
        <option value={f.id}>
          {f.firstName} {f.lastName} - {f.functional}
        </option>
      );
    });
  }
  async function makeOpLimit() {
    await createOL().then((data) => {
      setSelOpLimit(data.data);
      id = data.data.id;
    });
    await createSigSet(id).then((data) => {
      setSigSet(data.data);
    });
  }
  async function makeNewRev(selOpLimit) {
    let increment = 0.001;
    //this is needed due to precision issues with javascript.  if you dont force to fixed, it could increment by 0.00099.  this forces it to increment by 0.001
    let newNumb = parseFloat(
      (
        parseFloat(selOpLimit.limitNumber.toFixed(3)) +
        parseFloat(increment.toFixed(3))
      ).toFixed(3)
    );
    //first check to make sure there isnt already an Op Limit with that new number, return out of the function with an alert if there is.
    await checkRev(newNumb).then((data) => {
      if (data.length !== 0) {
        alert("That Op Limit already exists");
        return;
      }
    });
    //since there isnt already an op limit with that number, create one
    setSelOpLimit(delete selOpLimit.id);
    setSelOpLimit(delete selOpLimit.limitNumber);
    let nextOL = selOpLimit;
    nextOL = { ...nextOL, limitNumber: newNumb, olstat: "Draft" };
    await createRevisedOL(nextOL).then((data) => {
      id = data.data.id;
      setSelOpLimit(data.data);
    });
    //now create the corresponding signature set
    await createSigSet(id).then((data) => {
      setSigSet(data.data);
    });
  }
  const exportToPdf = () => {
    // setReportState(selOpLimit);
    // setReportState(...reportState, [sigSet]);

    navigate("/pdf", { state: { selOpLimit, sigSet } });
    // navigate(path);
    // <OpLimitReport selOpLimit={selOpLimit} sigSet={sigSet} />
  };

  const home = () => {
    navigate("/admin");
  };
  const newOpLimit = () => {
    // 👇️ makenewoplimit, set it to the selected
    makeOpLimit();
  };
  const newRev = () => {
    // make a new rev in the system then navigate to it
    makeNewRev(selOpLimit);
  };
  const cancelRev = () => {
    // deletes the record from teh database, is only allowed for draft Op Limits
    //first we ask them if they are sure, since there is no giong back from this one.
    if (window.confirm("Are you sure you want to cancel this Op Limit?")) {
      deleteDraft(selOpLimit.id);
    }
  };

  const submitForClosure = () => {
    // ask the user if they want to submit for closure, if yes, execute a put changing only the status to "Pending Closure"
    if (
      window.confirm(
        "Are you sure you want to submit this Op Limit for closure?"
      )
    ) {
      updateStatus('Pending Closure', selOpLimit.id);
    }
  };

  const submitForSig = () => {
    // ask the user if they want to submit for signatures then execute a put changing only the status to "Submitted for Signatures"
    if (
      window.confirm(
        "Are you sure you want to submit this draft for Signatures?"
      )
    ) {
      updateStatus('Awaiting Signatures', selOpLimit.id);
    }
  };

  return (
    <>
      <div className="op-limits-page">
        <Container>
          <div style={{ height: "20vh", overflowY: "scroll" }}>
            <Row className="justify-content-center">
              <Col sm={6} md={3} lg={3} className="justify-content-center">
                <Button
                  className="btn btn-success p-1 m-1 my-btn"
                  onClick={home}
                >
                  Home
                </Button>

                <Button
                  className="btn btn-success p-1 m-1 my-btn"
                  onClick={home}
                >
                  My Op Limits
                </Button>
              </Col>

              <Col sm={6} md={3} lg={3}>
                <Button
                  className="btn btn-dark p-1 m-1 my-btn"
                  onClick={newOpLimit}
                >
                  Create New Op Limit
                </Button>

                {recordLockState === true ? (
                  <Button
                    className="btn btn-dark p-1 m-1 my-btn"
                    onClick={newRev}
                  >
                    Create New Revision
                  </Button>
                ) : (
                  <Button
                    className="btn btn-warning p-1 m-1 my-btn"
                    onClick={submitForSig}
                  >
                    Submit For Signatures
                  </Button>
                )}
              </Col>

              <Col sm={6} md={3} lg={3}>
                <Button
                  className="btn btn-info p-1 m-1 my-btn"
                  onClick={exportToPdf}
                >
                  Export Op Limit
                </Button>
                {selOpLimit.olstat === "Draft" ? (
                  <Button
                    className="btn btn-danger p-1 m-1 my-btn"
                    onClick={cancelRev}
                  >
                    Cancel Draft Op Limit
                  </Button>
                ) : (
                  <Button
                    className="btn btn-danger p-1 m-1 my-btn"
                    onClick={submitForClosure}
                  >
                    Submit For Closure
                  </Button>
                )}
              </Col>
            </Row>
          </div>
          <div style={{ height: "40vh", overflowY: "scroll" }}>
            <Form onSubmit={handleFormSubmit}>
              <div>
                <Form.Group>
                  <Form.Label htmlFor="Title">Title</Form.Label>
                  <Form.Control
                    type="string"
                    name="limitTitle"
                    readOnly={recordLockState}
                    onBlur={handleFormSubmit}
                    onChange={handleInputChange}
                    value={selOpLimit.limitTitle}
                  />
                </Form.Group>
                <div>
                  <Row>
                    <Col sm={12} md={12} lg={4}>
                      <Form.Group>
                        <Form.Label htmlFor="Limit_number">
                          Op Limit Number
                        </Form.Label>
                        <Form.Control
                          type="string"
                          readOnly={true}
                          value={selOpLimit.limitNumber}
                          name="limitNumber"
                          //this one is determined by the backend; user cannot change the op limit number
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={12} lg={4}>
                      <Form.Group>
                        <Form.Label htmlFor="statusDate">
                          Status Date
                        </Form.Label>
                        <Form.Control
                          type="string"
                          name="statusDate"
                          //this one is changed by logic, use cannot change the status date
                          value={selOpLimit.statusDate}
                          readOnly
                        />
                      </Form.Group>
                    </Col>

                    <Col sm={12} md={12} lg={4}>
                      <Form.Group>
                        <Form.Label htmlFor="Status">Status</Form.Label>
                        <Form.Control
                          type="string"
                          name="olstat"
                          readOnly
                          value={selOpLimit.olstat}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6} md={6} lg={6}>
                      <Form.Group>
                        <Form.Label htmlFor="aircraft">Aircraft</Form.Label>
                        <Form.Control
                          as="select"
                          name="olaircraft"
                          onChange={handleAircraftSelectedChange}
                          value={selectedAircraft}
                          readOnly={recordLockState}
                        >
                          {aircraftSel()}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col sm={6} md={6} lg={6}>
                      <Form.Group>
                        <Form.Label htmlFor="limitType">Limit Type</Form.Label>
                        <Form.Control
                          as="select"
                          name="limitType"
                          onChange={handleTypeSelectedChange}
                          readOnly={recordLockState}
                          value={selectedType}
                        >
                          {typeSel()}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6} md={6} lg={6}>
                      <Form.Group>
                        <Form.Label htmlFor="olSystem">System</Form.Label>
                        <Form.Control
                          as="select"
                          name="olSystem"
                          onChange={handleSelectedSystemChange}
                          readOnly={recordLockState}
                          value={selectedSystem}
                        >
                          {systemSel()}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col sm={6} md={6} lg={6}>
                      <Form.Group>
                        <Form.Label htmlFor="olconfiguration">
                          Configuration
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="olconfiguration"
                          onChange={handleSelectedConfigurationChange}
                          readOnly={recordLockState}
                          value={selectedConfiguration}
                        >
                          {configurationSel()}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group>
                    <Form.Label htmlFor="teams">
                      Team / Functional Area
                    </Form.Label>
                    <Form.Control
                      type="array"
                      name="olfunctionalArea"
                      onBlur={handleFormSubmit}
                      onChange={handleInputChange}
                      value={selOpLimit.olfunctionalArea}
                      readOnly={recordLockState}
                    ></Form.Control>
                  </Form.Group>
                </div>

                <Form.Group>
                  <Form.Label htmlFor="statement">Limit Statement</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="statement"
                    onBlur={handleFormSubmit}
                    onChange={handleInputChange}
                    value={selOpLimit.statement}
                    readOnly={recordLockState}
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="justification">
                    Limit Justification
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="justification"
                    onBlur={handleFormSubmit}
                    onChange={handleInputChange}
                    value={selOpLimit.justification}
                    readOnly={recordLockState}
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="crewACtions">Crew Actions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="crewActions"
                    onBlur={handleFormSubmit}
                    onChange={handleInputChange}
                    value={selOpLimit.crewActions}
                    readOnly={recordLockState}
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="inspectionReq">
                    Inspection Requirements
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="inspectionReq"
                    onBlur={handleFormSubmit}
                    onChange={handleInputChange}
                    value={selOpLimit.inspectionReq}
                    readOnly={recordLockState}
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="Title">Closure Criteria</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="closureCrit"
                    onChange={handleInputChange}
                    onBlur={handleFormSubmit}
                    value={selOpLimit.closureCrit}
                    readOnly={recordLockState}
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="Title">Admin Log</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="admin_log"
                    onChange={handleInputChange}
                    onBlur={handleFormSubmit}
                    value={selOpLimit.admin_log}
                    readOnly={recordLockState}
                  ></Form.Control>
                </Form.Group>
              </div>
              <Row className="justify-content-center">
                <Col sm={6} md={5} lg={5}>
                  {/* put in the navair signatures here */}
                  <p className="text-center">Navair Signatures</p>
                  <Row>
                    {/* Class  Desk */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        Class Desk
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            as="Select"
                            style={{ width: "100%" }}
                            name="cd"
                            aria-label="cd"
                            onChange={handleApmseSelectedChange}
                            value={selectedApmse}
                            isDisabled={recordLockState}
                          >
                            {apmseSig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            className="p-1
                        "
                            id="cdSig"
                            name="cdSig"
                            value={sigSet.cdsig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* GFTD */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        GFTD
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            name="gftd"
                            aria-label="gftd"
                            onChange={handleGftdSelectedChange}
                            value={selectedGftd}
                            isDisabled={recordLockState}
                          >
                            {gftdSig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            className="p-1
                        "
                            id="GFTDSig"
                            name="GFTDSig"
                            value={sigSet.gftdsig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Coord */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        Coordinator
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            as="select"
                            name="coord"
                            aria-label="coord"
                            value={selectedCoord}
                            isDisabled={recordLockState}
                            onChange={handleCoordSelectedChange}
                          >
                            {coordSig("coord")}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            className="p-1
                        "
                            id="GFTDSig"
                            name="GFTDSig"
                            value={sigSet.coordsig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* sme1 */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        TAE
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            value={selectedSme1}
                            name="sme1"
                            isDisabled={recordLockState}
                            onChange={handleSme1SelectedChange}
                          >
                            {sme1Sig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            className="p-1
                        "
                            id="sme1sig"
                            name="sme1sig"
                            value={sigSet.sme1sig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* sme2 */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        TAE
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            as="select"
                            name="sme2"
                            aria-label="sme2"
                            isDisabled={recordLockState}
                            onChange={handleSme2SelectedChange}
                            value={selectedSme2}
                            selected
                          >
                            {sme2Sig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="sme2sig"
                            name="sme2sig"
                            value={sigSet.sme2sig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* sme3 */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        TAE
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            as="select"
                            name="sme3"
                            isDisabled={recordLockState}
                            onChange={handleSme3SelectedChange}
                            value={selectedSme3}
                            selected
                          >
                            {sme3Sig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="sme3sig"
                            name="sme3sig"
                            value={sigSet.sme3sig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* sme4 */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        TAE
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            as="select"
                            name="sme4"
                            isDisabled={recordLockState}
                            onChange={handleSme4SelectedChange}
                            value={selectedSme4}
                            selected
                          >
                            {sme4Sig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="sme4sig"
                            name="sme4sig"
                            value={sigSet.sme4sig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Row>
                </Col>

                {/* put in the vendor signature blocks here */}
                <Col sm={6} md={5} lg={5}>
                  {/* put in the navair signatures here */}
                  <p className="text-center">Vendor Signatures</p>
                  <Row>
                    {/* Class  Desk */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        Vendor CHENG
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            as="select"
                            name="vcheng"
                            aria-label="vcheng"
                            onChange={handlevChengSelectedChange}
                            value={selectedvCheng}
                            isDisabled={recordLockState}
                            selected
                          >
                            {vchengSig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="vchengsig"
                            name="vchengsig"
                            value={sigSet.vchengsig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* GFTD */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        Vendor Test Director
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            as="select"
                            name="vtd"
                            aria-label="vtd"
                            onChange={handlevtdSelectedChange}
                            value={selectedvtd}
                            isDisabled={recordLockState}
                          >
                            {vtdSig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="vtdsig"
                            name="vtdsig"
                            value={sigSet.vtdsig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Coord */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        Vendor Coordinator
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            as="select"
                            name="vcoord"
                            aria-label="vcoord"
                            onChange={handlevCoordSelectedChange}
                            value={selectedvcoord}
                            isDisabled={recordLockState}
                          >
                            {vcoordSig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="vcoordsig"
                            name="vcoordsig"
                            value={sigSet.vcoordsig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* sme1 */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        Vendor SME
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            as="select"
                            name="v1"
                            aria-label="v1"
                            isDisabled={recordLockState}
                            onChange={handlev1SelectedChange}
                            value={selectedv1}
                          >
                            {v1Sig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="v1sig"
                            name="v1sig"
                            value={sigSet.v1sig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* sme2 */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        Vendor SME
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            as="select"
                            name="v2"
                            aria-label="v2"
                            onChange={handlev2SelectedChange}
                            value={selectedv2}
                            isDisabled={recordLockState}
                          >
                            {v2Sig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="v2sig"
                            name="v2sig"
                            value={sigSet.v2sig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* sme3 */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        Vendor SME
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            as="select"
                            name="v3"
                            aria-label="v3"
                            onChange={handlev3SelectedChange}
                            value={selectedv3}
                            isDisabled={recordLockState}
                          >
                            {v3Sig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="v3sig"
                            name="v3sig"
                            value={sigSet.v3sig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* sme4 */}
                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        Vendor SME
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Select
                            style={{ width: "100%" }}
                            as="select"
                            name="v4"
                            aria-label="v4"
                            onChange={handlev4SelectedChange}
                            value={selectedv4}
                            isDisabled={recordLockState}
                          >
                            {v4Sig()}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="v4sig"
                            name="v4sig"
                            value={sigSet.v4sig}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Row>
                </Col>
              </Row>
            </Form>
          </div>

          <div
            className="pt-3"
            style={{ height: "35vh", overflowX: "scroll", overflowY: "scroll" }}
          >
            {selOpLimit && (
              <OpLimitTable
                aircraftState={aircraftState}
                limitType={limitType}
                selOpLimit={selOpLimit}
                setSelOpLimit={setSelOpLimit}
                setSigSet={setSigSet}
                sigSet={sigSet}
              />
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default AdminOpLimitsPage;

