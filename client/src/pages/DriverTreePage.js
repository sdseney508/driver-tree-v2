//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import { stateContext } from "../App";
import { PDFExport } from "@progress/kendo-react-pdf";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import {
  createOutcome,
  getDriverByOutcome,
  getOutcome,
  outcomeByCommand,
} from "../utils/drivers";

import { createView, deleteView } from "../utils/views";
// import { getArrows } from "../utils/arrows";
import { useNavigate } from "react-router";
import { useParams } from "react-router"; //to store state in the URL
import DriverCards from "../components/driverCards";
import { getAppData, loggedIn, getToken, getUser } from "../utils/auth";
import styles from "./DriverTreePage.module.css";
import OutcomeTable from "../components/OutcomeTable";
import ClusterModal from "../components/ClusterModal";
import { getArrows } from "../utils/arrows";
import { getViewArrows } from "../utils/viewArrows";
import { getViewCards } from "../utils/viewCards";
// import { exportElement } from "../utils/export-element";
import { getUserViewsForOutcome } from "../utils/views";
import ViewsTable from "../components/ViewsTable";
import { Xwrapper } from "react-xarrows";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const DriverTreePage = () => {
  const [state, setState] = useContext(stateContext);
  const [clusters, setClusters] = useState([]);
  const [arrows, setArrows] = useState("");
  const [createArrow, setCreateArrow] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [PDFState, setPDFState] = useState(false);
  const [showArrowMod, setArrowMod] = useState(false);
  const [selOutcome, setSelOutcome] = useState({});
  const [driverTreeObj, setDriverTreeObj] = useState([]);
  const [showClusterModal, setClusterModal] = useState(false);
  const [selDriver, setSelDriver] = useState({});
  const [recordLockState, setRecordLockState] = useState(false); //used to lock the record when a user is editing it, reads the user's account permissions and adjusts record locks accordingly, stakeholders have read only access.
  const [viewId, setViewId] = useState(""); //used to let the user cycle through their personal views, the view state is the view id in case multiple users create same named views.
  const [viewObj, setViewObj] = useState([]); //used to store the view object for the view cards
  const [viewArrows, setViewArrows] = useState([]); //used to store the view arrows for the view cards
  const [tableState, setTableState] = useState("outcome"); //used to toggle the table at the bottom of the page. const [connectionShow, setConnectionShow] = useState(false);

  const pdfExportComponent = React.useRef(null);

  let tableStyle = { height: "25vh", width: "100%", overFlowY: "scroll" };
  let driverStyle = {
    height: "60vh",
    overFlowY: "scroll",
    overFlowX: "hidden",
  }; //custom styles for the divs down below
  const [showTable, setShowTable] = useState({ tableStyle, driverStyle }); //show or not show the Outcomes/views tables at the bottom of the page
  const pdfStyle = {
    height: "fit-content",
    overFlowY: "visible",
    overFlowX: "visible",
  };

  const { outcomeId } = useParams();
  //custom styles for the divs down below

  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value

  let navigate = useNavigate();

  //using the initial useEffect hook to open up the driver trees and prefill the table at the bottom of the page
  useEffect(() => {
    const getAppData = async () => {
      //this first part just ensures they whoever is on this page is an authenticated user; prevents someone from typing in the url and gaining access
      try {
        //these comes from the utils section of the code
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
    
        let userDataLength = Object.keys(user).length;
        //used to make sure they have permissions to make changes
        //if the user isnt logged in with an unexpired token, send them to the login page
        if (!userDataLength > 0) {
          navigate("/");
        } else {
          setState({
            ...state,
            firstName: user.firstName,
            lastName: user.lastName,
            Role: user.userRole,
            command: user.stakeholderId,
            userId: user.id,
          });
          //checks to see if there was an outcomeId passed or if you entered from the user page
          if (!outcomeId) {
            await outcomeByCommand(user.stakeholderId).then((data) => {
              setSelOutcome(data.data[0]);
            });
          } else {
            await getOutcome(outcomeId).then((data) => {
              setSelOutcome(data.data);
            });
          }
          return state;
        }
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };
    getAppData();
    if (state.Role === "Stakeholder") {
      setRecordLockState(true);
    }
    console.log(state);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getInfo = async () => {
      if (!selOutcome.id) {
        selOutcome.id = outcomeId;
      } 
      await getOutcome(selOutcome.id).then((data) => {
        setState({ ...state, selOutcome: data.data });
      });
      await getDriverByOutcome(selOutcome.id).then((data) => {
        setDriverTreeObj(data.data);
      });
      await getArrows(selOutcome.id).then((data) => {
        setArrows(data.data);
      });
      await getViewCards(viewId).then((data) => {
        setViewObj(data.data);
      });
      await getViewArrows(viewId).then((data) => {
        setViewArrows(data.data);
      });
    };

    getInfo();
    console.log(viewId);
    if (state.Role === "Stakeholder") {
      setRecordLockState(true);
    }
    navigate("/drivertree/" + selOutcome.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selOutcome, viewId, tableState]);

  const createNewView = async (e) => {
    e.preventDefault();
    let body = {
      userId: state.userId,
      outcomeId: selOutcome.id,
      viewName: "New View",
    };
    await createView(body).then((data) => {
      setViewId(data.data.id);
    });
  };

  const deleteSelectedView = async (e) => {
    e.preventDefault();
    await deleteView(viewId);
    setViewId("");
  };

  //use the showTable state to show or hide the table at the bottom of the page by changing the height of the div and passing that variable to the inline style
  const customStyles = (table) => {
    //first check to see if the user is trying to hide the table, then toggle the styles
    if (tableState === table) {
      tableStyle = { height: "0vh", overFlowY: "scroll" };
      driverStyle = {
        height: "80vh",
        overFlowY: "scroll",
        overFlowX: "hidden",
      };
      setOpacity(100);
      setTableState("");
    } else if (table === "outcome") {
      tableStyle = { height: "25vh", width: "100%", overFlowY: "scroll" };
      driverStyle = {
        height: "60vh",
        overFlowY: "scroll",
        overFlowX: "hidden",
      };
      setOpacity(100);
      setTableState("outcome");
    } else if (table === "view") {
      tableStyle = { height: "25vh", width: "350px", overFlowY: "scroll" };
      driverStyle = {
        height: "60vh",
        overFlowY: "scroll",
        overFlowX: "hidden",
      };
      setTableState("view");
    }
    setShowTable({ tableStyle, driverStyle });
  };

  const goToDriver = async (e) => {
    e.preventDefault();
    navigate("/drpage/" + selOutcome.id + "/" + driverTreeObj[0].id);
  };

  //creates new outcome and then resets the selOutcome state.  This cause a a useEffect fire and refreshes the page.
  const newOutcome = async () => {
    console.log(state);
    let body = { stakeholderId: state.command, userId: state.userId };
    createOutcome(body).then((data) => {
      setState({ ...state, outcomeId: data.data.id });
      setSelOutcome(data.data);
    });
  };

  const svgForPdf = () => {
    //this function takes in an array of svgs from the arrows, pulls out the <path> and <g> elements, then creates a new svg element and appends the path and g elements to it.  it then returns the SVG element in a div for appending to the DOM.  The <div> element has an absolute position based on the position of the arrow svg element that is passed in as part of the entering arguement.
    //first we remove the first element in svgs
    // debugger;
    let svgs = document.querySelectorAll("svg");

    let svgArray = Array.from(svgs);
    // eslint-disable-next-line array-callback-return
    svgArray.map((f, index) => {
      if (svgArray[index].id.slice(0, 3) === "SVG") {
        let innerSVG = svgArray[index].innerHTML;
        let width = svgArray[index].getBoundingClientRect().width;
        if (width > 300) {
          width = 300;
        }
        let height = svgArray[index].getBoundingClientRect().height;

        let svgstuff = `<svg
        width="${width}px"
        height="${height}px"
        xmlns="http://www.w3.org/2000/svg"
        >
          ${innerSVG}
    </svg>`;
        let svgdiv = document.createElement("div");

        let svgtop = svgArray[index].getBoundingClientRect().top;
        //the additional offset accounts for delta between cards and column widths

        let svgleft = svgArray[index].getBoundingClientRect().left * 0.997;
        svgdiv.setAttribute(
          "style",
          `position: absolute; top: ${svgtop}px; left: ${svgleft}px; z-index: 10; width: ${width}px; height: ${height}px;`
        );

        svgdiv.innerHTML = svgstuff;
        let pdfExport = document.getElementById("pdf-export");
        pdfExport.appendChild(svgdiv);
      }
    });
  };
  const onModalSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };

  //close the modal
  const handleClose = () => {
    setClusterModal(false);
    setArrowMod(false);
  };

  //used to clean the cards up for a PDF generation
  useEffect(() => {
    //needed to prevent a random pdf from generating on every page load
    if (PDFState && document.readyState === "complete") {
      setTableState("");
      svgForPdf();
      // let options = {
      //   papersize: "auto",
      //   margin: "25px",
      //   landscape: true,
      // };
      if (pdfExportComponent.current) {
        pdfExportComponent.current.save();
      }
      // let pdfExport = document.getElementById("pdf-export");
      // exportElement(pdfExport, options, selOutcome.outcomeTitle);
      window.location.reload();
    }
    setPDFState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PDFState]);

  const handleClick = () => {
    setPDFState(true);
  };

  const toggleArrow = () => {
    setCreateArrow(!createArrow);
  };

  const updateOpacity = (e) => {
    setOpacity(e.target.value / 100);
  };

  return (
    <>
      <div id="topleveldiv" key="topleveldiv" className={styles.driver_page}>
        {/* className={styles.driver_page}  */}
        <Container fluid className="justify-content-center">
          <div style={{ height: "40px" }} className="justify-content-center">
            {state.Role !== "Stakeholder" ? (
              <Col style={{ maxWidth: "900px" }}>
                <button
                  className={styles.dtree_btn}
                  onClick={() => {
                    handleClick();
                  }}
                >
                  Generate PDF
                </button>
                <button className={styles.dtree_btn} onClick={goToDriver}>
                  Driver Details
                </button>
                <button className={styles.dtree_btn} onClick={newOutcome}>
                  New Outcome
                </button>
                <button
                  className={styles.dtree_btn}
                  onClick={() => setClusterModal(true)}
                >
                  Create Cluster
                </button>

                <button
                  className={styles.dtree_btn}
                  onClick={() => toggleArrow()}
                >
                  Create Arrow
                </button>
                <button
                  className={styles.dtree_btn}
                  onClick={() => customStyles("outcome")}
                >
                  Outcomes
                </button>
                <button
                  className={styles.dtree_btn}
                  onClick={() => customStyles("view")}
                >
                  Views
                </button>
              </Col>
            ) : (
              <Col>
                <button className={styles.dtree_btn} onClick={handleClick}>
                  Generate PDF
                </button>
              </Col>
            )}
          </div>
          <PDFExport
            ref={pdfExportComponent}
            paperSize="auto"
            margin={40}
            
          >
            <Row
            id="pdf-export"
            style={PDFState ? pdfStyle : showTable.driverStyle}
            className={styles.pdf_export}
          >
            <Xwrapper>
              {driverTreeObj && arrows && state.selOutcome ? (
                <DriverCards
                  arrows={arrows}
                  setArrows={setArrows}
                  driverTreeObj={driverTreeObj}
                  setDriverTreeObj={setDriverTreeObj}
                  cluster={clusters}
                  setClusters={setClusters}
                  createArrow={createArrow}
                  opacity={opacity}
                  setOpacity={setOpacity}
                  PDFState={PDFState}
                  recordLockState={recordLockState}
                  state={state}
                  setCreateArrow={setCreateArrow}
                  setArrowMod={setArrowMod}
                  selOutcome={state.selOutcome}
                  setSelOutcome={setSelOutcome}
                  showArrowMod={showArrowMod}
                  tableState={tableState}
                  viewId={viewId}
                  setViewId={setViewId}
                  viewObj={viewObj}
                  setViewObj={setViewObj}
                  viewArrows={viewArrows}
                  setViewArrows={setViewArrows}
                />
              ) : null}
            </Xwrapper>
            </Row>
          </PDFExport>
          <div style={showTable.tableStyle}>
            {tableState === "outcome" ? (
              <OutcomeTable
                state={state}
                setState={setState}
                selOutcome={selOutcome}
                setSelOutcome={setSelOutcome}
                command={state.command}
                userId={state.userId}
              />
            ) : null}

            {tableState === "view" ? (
              <Row className={styles.views_container}>
                <Col
                  style={{
                    overFlowY: "scroll",
                    width: "500px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div>Adjust Opacity</div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={opacity}
                    // className={styles.slider}
                    id="myRange"
                    onChange={(e) => updateOpacity(e)}
                  ></input>
                  <button
                    className={styles.dtree_btn}
                    onClick={(e) => createNewView(e)}
                    style={{ width: "150px", height: "25px" }}
                  >
                    Create View
                  </button>

                  <button
                    className={styles.dtree_btn}
                    onClick={(e) => deleteSelectedView(e)}
                    style={{ width: "150px", height: "25px" }}
                  >
                    Delete View
                  </button>
                  <ViewsTable
                    outcomeId={outcomeId}
                    viewId={viewId}
                    setViewId={setViewId}
                    userId={state.userId}
                  />
                </Col>
                <Col className={styles.slidecontainer}></Col>
              </Row>
            ) : null}
          </div>
        </Container>
      </div>
      {/* for creating a cluster */}
      <Modal
        name="clusterModal"
        show={showClusterModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setClusterModal(false)}
        // className={styles.cluster_modal}
      >
        <Modal.Header closeButton>
          <Modal.Title id="cluster-modal">Create Cluster</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*change everything in the signup form components*/}
          <ClusterModal
            onModalSubmit={onModalSubmit}
            selDriver={selDriver}
            setSelDriver={setSelDriver}
            selOutcome={selOutcome}
            setSelOutcome={setSelOutcome}
            driverTreeObj={driverTreeObj}
          />
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DriverTreePage;
