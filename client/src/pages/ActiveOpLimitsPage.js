//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { stateContext } from "../App";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { getUser, loggedIn, getToken } from '../utils/auth'
import OpLimitTable from "../components/OpLimitTable";
import {
  activeOL,
  allOL,
  getSigSets,
  createOL,
  createSigSet,
  checkRev,
  createRevisedOL,
  updateOL,
  getOneOL,
} from "../utils/limits";
import {makeOL} from "../utils/buttons";
import "./NewOpLimitsPage.css";
import "./button.css";
// import pdfreport from "../utils/pdf";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate, useLocation } from "react-router";
import pdfreport from "../utils/pdf";

const ActiveOpLimitsPage = () => {
  const [state, setState] = useContext(stateContext);
  const [aircraftState, setAircraftState] = useState([]);
  const [selOpLimit, setSelOpLimit] = useState([]);
  const [sigSet, setSigSet] = useState({});

  let navigate = useNavigate();
  let location = useLocation();
  let id;

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
        setState({...state, 
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          id: user.id,
          userRole: user.userRole,
          functionalArea: user.functional,
        });       
        let userDataLength = Object.keys(user).length;
        //if the user isnt logged in with an unexpired token, send them to the login page
        if (!userDataLength>0) {
          navigate('/');
        }
      } catch (err) {
        console.error(err);
      }
    };
    getUserData();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //this only fires on initial load, after that the form is fed from the child table;
  async function fetchData() {
    switch (location.state.limitType) {
      case "All":
        await allOL().then((data) => {
          id = data.data[0].id;
          setSelOpLimit(data.data[0]);
        });
        break;
      case "Active":
        await activeOL().then((data) => {
          id = data.data[0].id;
          setSelOpLimit(data.data[0]);
        });
        break;

      default:
        break;
    }
    await getSigSets(id).then((data) => {
      setSigSet(data.data);
    });
  }

  //this function creates a new op limit.  it looks for the highest op limit number, increments it by 1, and creates a new op limit with that number.  it also creates a new signature set for that op limit.
  async function makeOpLimit() {
    let log = `${state.firstName} ${state.lastName} created a new Op Limit on ${new Date().toLocaleString()}`;
    await createOL(log).then((data) => {
      setSelOpLimit(data.data);
      id = data.data.id;
    });
    await createSigSet(id).then((data) => {
      setSigSet(data.data);
    });
    navigate("/draftoplimits");
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
    debugger;
    //first check to make sure there isnt already an Op Limit with that new number, return out of the function with an alert if there is.
    await checkRev(newNumb).then((data) => {
      if (data.length !== 0) {
        alert("That Op Limit already exists");
        return
      }
    });
    debugger;
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
    navigate("/draftoplimits");
  }

  const exportToPdf = () => {
    // export the selected Op Limit to a PDF; exports the entire op limit and  the signature set
// debugger;
    alert("Disabled For Demo");
  // navigate("/pdf");
    // console.log("exporting to pdf");
    // debugger;
    // // const olReport = document.getElementById("opLimitReport");
    // let olReport = new jsPDF("portrait", "pt", "letter");
    // olReport.html(document.getElementById('opLimitReport'), {
		// 	callback: function (olReport) {
		// 		var iframe = document.createElement('iframe');
		// 		iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:75%; width:75%');
		// 		document.body.appendChild(iframe);
		// 		// iframe.src = olReport.output('datauristring');
    //     olReport.save("OpLimitReport.pdf");
    //     return
				//var div = document.createElement('pre');
				//div.innerText=pdf.output();
				//document.body.appendChild(div);
		// 	}
		// });

    // html2canvas(olReport, {
    //   onclone: (document) => {
    //     document.getElementById("opLimitReport").style.visibility = "hidden";
    //   },
    // }).then(canvas => {
    //   const imgData = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF("portrait", "pt", "letter");
    //   pdf.addImage(imgData, "PNG", 10, 10);
    //   pdf.save("OpLimitReport.pdf");
    // });

    // const makeOpLimitPDF = async () => {
    //   const opLimitReport = new jsPDF("portrait", "pt", "a4");
    //   opLimitReport.html(document.querySelector("#opLimitReport")).then(() => {
    //     opLimitReport.save(`OpLimitReport.pdf`);
    //   });
    // };
    // console.log("exported to pdf");
  };

  const newOpLimit = () => {
    // 👇️ makenewoplimit, set it to the selected
    makeOpLimit();
  };
  const newRev = () => {
    // make a new rev in the system then navigate to it
    makeNewRev(selOpLimit);
  };

  const updateStatus = async (status, id) => {
    let body = {
      olstat: status,
    };
    await updateOL(id, body)
      .then()
      .catch((err) => console.log(err));
    setSelOpLimit(getOneOL(id));
  };

  const submitForClosure = () => {
    // ask the user if they want to submit for closure, if yes, execute a put changing only the status to "Pending Closure"
    if (
      window.confirm(
        "Are you sure you want to submit this Op Limit for closure?"
      )
    ) {
      updateStatus("Pending Closure", selOpLimit.id);
    }
    navigate("/sign");
  };

  const submitForSig = () => {
    // ask the user if they want to submit for signatures then execute a put changing only the status to "Submitted for Signatures"
    if (
      window.confirm(
        "Are you sure you want to submit this draft for Signatures?"
      )
    ) {
      updateStatus("Awaiting Signatures", selOpLimit.id);
    }
  };

  const revertToActive = () => {
    // ask the user if they want to revert to active then execute a put changing only the status to "Active"
    if (
      window.confirm(
        "Are you sure you want to revert this Op Limit to Active?"
      )
    ) {
    updateStatus("Active", selOpLimit.id);
    }
  };

  const editDraft = () => {
    //navigate to the draft op limits page so the fields will be unlocked and the user can edit the op limit; only works if the op limit is in draft status
    navigate("/draftoplimits");
  };

  return (
    <>
      <div className="op-limits-page" >
        <Container style={{ height: "100vh"}}>
          <div style={{ height: "10vh", overflowY: "scroll" }}>
            <Row className="justify-content-center">
              <Col sm={8} md={3} lg={3}>
                <Button
                  className="btn btn-primary p-1 m-1 my-btn"
                  onClick={newOpLimit}
                >
                  Create New Op Limit
                </Button>
              </Col>
              <Col sm={8} md={3} lg={3}>
                {selOpLimit.olstat === "Active" ||
                selOpLimit.olstat === "Closed" || selOpLimit.olstat === "Awaiting Signatures" ? (
                  <Button
                    className="btn btn-light p-1 m-1 my-btn"
                    onClick={newRev}
                  >
                    Create New Revision
                  </Button>
                ) : selOpLimit.olstat === "Draft" ? (
                  <Button
                    className="btn btn-light p-1 m-1 my-btn"
                    onClick={submitForSig}
                  >
                    Submit Op Limit For Signature
                  </Button>
                ) : (
                  <Button
                    className="btn btn-light p-1 m-1 my-btn"
                    onClick={submitForSig}
                  >
                    Sign Op Limit
                  </Button>
                )}
              </Col>
              <Col sm={8} md={3} lg={3}>
                <Button
                  className="btn btn-info p-1 m-1 my-btn"
                  onClick={exportToPdf}
                >
                  Export Op Limit
                </Button>
              </Col>
              <Col sm={8} md={3} lg={3}>
                {selOpLimit.olstat !== "Draft" ? (
                  selOpLimit.olstat === "Awaiting Signatures" ? (
                    <Button
                      className="btn btn-success p-1 m-1 my-btn"
                      onClick={revertToActive}
                    >
                      Revert to Active
                    </Button>
                  ) : (
                    <Button
                      className="btn btn-danger p-1 m-1 my-btn"
                      onClick={submitForClosure}
                    >
                      Submit For Closure
                    </Button>
                  )
                ) : (
                  <Button
                    className="btn btn-danger p-1 m-1 my-btn"
                    onClick={editDraft}
                  >
                    Edit Draft
                  </Button>
                )}
              </Col>
            </Row>
          </div>

          <div id="opLimitReport" style={{ height: "60vh", overflowY: "scroll" }}>
            <Form readOnly={true}>
              <div>
                <Form.Group>
                  <Form.Label htmlFor="Title">Title</Form.Label>
                  <Form.Control
                    type="string"
                    readOnly={true}
                    placeholder="Op Limit Title"
                    name="Title"
                    // onChange={handleInputChange}
                    value={selOpLimit.limitTitle}
                  />
                </Form.Group>

                <Row>
                  <Col sm={12} md={12} lg={4}>
                    <Form.Group>
                      <Form.Label htmlFor="Title">Op Limit Number</Form.Label>
                      <Form.Control
                        type="string"
                        readOnly={true}
                        placeholder="Op Limit Number"
                        name="Title"
                        // onChange={handleInputChange}
                        value={selOpLimit.limitNumber}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={12} lg={4}>
                    <Form.Group>
                      <Form.Label htmlFor="Title">Status Date</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="DD/MM/YYYY"
                        name="statusDate"
                        readOnly={true}
                        // onChange={handleInputChange}
                        value={selOpLimit.statusDate}
                      />
                    </Form.Group>
                  </Col>

                  <Col sm={12} md={12} lg={4}>
                    <Form.Group>
                      <Form.Label htmlFor="Status">Status</Form.Label>
                      <Form.Control
                        type="string"
                        name="status"
                        readOnly={true}
                        // onChange={handleInputChange}
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
                        type="array"
                        readOnly={true}
                        placeholder="Aircraft Number"
                        name="status"
                        // onChange={handleInputChange}
                        defaultValue={selOpLimit.aircraft != null ? selOpLimit.aircraft : "Select an Aircraft"}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={6} lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="limitType">Limit Type</Form.Label>
                      <Form.Control
                        type="array"
                        placeholder="Flight"
                        name="limitType"
                        readOnly={true}
                        // onChange={handleInputChange}
                        defaultValue={selOpLimit.limitType != null ? selOpLimit.limitType : "Select a Limit Type"}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={6} md={6} lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="system">System</Form.Label>
                      <Form.Control
                        type="array"
                        placeholder="System"
                        name="system"
                        readOnly={true}
                        // onChange={handleInputChange}
                        defaultValue={selOpLimit.system != null ? selOpLimit.system : "Select a System"}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={6} lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="limitType">Configuration</Form.Label>
                      <Form.Control
                        type="array"
                        placeholder="Configuration"
                        name="configuration"
                        readOnly={true}
                        // onChange={handleInputChange}
                        value={selOpLimit.configuration != null ? selOpLimit.configuration : "Select a Configuration"}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group>
                  <Form.Label htmlFor="teams">
                    Team / Functional Area
                  </Form.Label>
                  <Form.Control
                    type="array"
                    placeholder="Teams or Functional Areas"
                    name="teams"
                    readOnly={true}
                    // onChange={handleInputChange}
                    value={selOpLimit.functionalArea}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="statement">Limit Statement</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Describe the Limit"
                    name="statement"
                    readOnly={true}
                    // onChange={handleInputChange}
                    value={selOpLimit.statement}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="justification">
                    Limit Justification
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Why Does The Limit Exist?"
                    name="justification"
                    readOnly={true}
                    // onChange={handleInputChange}
                    value={selOpLimit.justification}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="crewACtions">Crew Actions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="What should the aircrew do if they exceed the limit?"
                    name="crewActions"
                    readOnly={true}
                    // onChange={handleInputChange}
                    value={selOpLimit.crewActions}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="inspectionReq">
                    Inspection Requirements
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Are there any inspections required if limit exceeded?"
                    readOnly={true}
                    name="inspectionReq"
                    // onChange={handleInputChange}
                    value={selOpLimit.inspectionReq}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="Title">Closure Criteria</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    readOnly={true}
                    placeholder="What is needed to close the Op Limit?"
                    name="closureCrit"
                    // onChange={handleInputChange}
                    value={selOpLimit.closureCrit}
                  />
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
                          <Form.Control
                            type="text"
                            style={{ width: "100%" }}
                            name="cd"
                            id="cd"
                            placeholder="Class Desk"
                            value={sigSet.cdname != null ? sigSet.cdname : " "}
                            readOnly={true}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            className="p-1"
                            id="cdSig"
                            name="cdSig"
                            // onChange={handleFormSubmit}
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
                          <Form.Control
                            style={{ width: "100%" }}
                            name="gftd"
                            value={sigSet.gftdname != null ? sigSet.gftdname : " "}
                            readOnly={true}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            className="p-1"
                            id="GFTDSig"
                            name="GFTDSig"
                            // onChange={handleFormSubmit}
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
                          <Form.Control
                            style={{ width: "100%" }}
                            type="string"
                            name="coord"
                            value={sigSet.coordname != null ? sigSet.coordname : " "}
                            readOnly={true}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            className="p-1"
                            id="coordsig"
                            name="coordsig"
                            // onChange={handleFormSubmit}
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
                          <Form.Control
                            style={{ width: "100%" }}
                            value={sigSet.sme1name != null ? sigSet.sme1name : " "}
                            name="sme1"
                            readOnly={true}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            className="p-1"
                            id="sme1sig"
                            name="sme1sig"
                            // onChange={handleFormSubmit}
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
                          <Form.Control
                            style={{ width: "100%" }}
                            type="string"
                            name="sme2"
                            readOnly={true}
                            value={sigSet.sme2name != null ? sigSet.sme2name : " "}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="sme2sig"
                            name="sme2sig"
                            // onChange={handleFormSubmit}
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
                          <Form.Control
                            style={{ width: "100%" }}
                            type="string"
                            name="sme3"
                            readOnly={true}
                            value={sigSet.sme3name != null ? sigSet.sme3name : " "}
                            selected
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="sme3sig"
                            name="sme3sig"
                            // onChange={handleFormSubmit}
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
                          <Form.Control
                            style={{ width: "100%" }}
                            type="string"
                            name="sme4"
                            readOnly={true}
                            value={sigSet.sme4name != null ? sigSet.sme4name : " "}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={4} lg={4}>
                        <Form.Group as={Col}>
                          <Form.Control
                            type="date"
                            id="sme4sig"
                            name="sme4sig"
                            // onChange={handleFormSubmit}
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
                          <Form.Control
                            style={{ width: "100%" }}
                            type="string"
                            name="vcheng"
                            value={sigSet.vchengname != null ? sigSet.vchengname : " "}
                            readOnly={true}
                          ></Form.Control>
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
                          <Form.Control
                            style={{ width: "100%" }}
                            type="string"
                            name="vtd"
                            value={sigSet.vtdname != null ? sigSet.vtdname : " "}
                            readOnly={true}
                          ></Form.Control>
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
                          <Form.Control
                            style={{ width: "100%" }}
                            type="string"
                            name="vcoord"
                            value={sigSet.vcoordname != null ? sigSet.vcoordname : " "}
                            readOnly={true}
                          ></Form.Control>
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
                          <Form.Control
                            style={{ width: "100%" }}
                            type="string"
                            name="v1"
                            readOnly={true}
                            value={sigSet.v1name != null ? sigSet.v1name : " "}
                          ></Form.Control>
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
                          <Form.Control
                            style={{ width: "100%" }}
                            type="string"
                            name="v2"
                            value={sigSet.v2name != null ? sigSet.v2name : " "}
                            readOnly={true}
                          ></Form.Control>
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
                          <Form.Control
                            style={{ width: "100%" }}
                            type="string"
                            name="v3"
                            value={sigSet.v3name != null ? sigSet.v3name : " "}
                            readOnly={true}
                          ></Form.Control>
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

                    <Row>
                      <Form.Label
                        className="text-center"
                        style={{ width: "100%" }}
                      >
                        Vendor SME
                      </Form.Label>
                      <Col sm={8} md={8} lg={8}>
                        <Form.Group>
                          <Form.Control
                            style={{ width: "100%" }}
                            type="string"
                            name="v4"
                            aria-label="v4"
                            value={sigSet.v4name != null ? sigSet.v4name : " "}
                            readOnly={true}
                          ></Form.Control>
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

          <div style={{ height: "30vh", overflowY: "scroll" }}>
            <OpLimitTable
              aircraftState={aircraftState}
              limitType={location.state.limitType}
              selOpLimit={selOpLimit}
              setSigSet={setSigSet}
              setSelOpLimit={setSelOpLimit}
              sigSet={sigSet}
            />
          </div>
        </Container>
      </div>
    </>
  );
};

export default ActiveOpLimitsPage;
