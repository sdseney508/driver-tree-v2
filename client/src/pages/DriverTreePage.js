/* eslint-disable no-loop-func */
//page for viewing and updating op limits
import React, { useState, useEffect } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import {
  createDriver,
  createOutcome,
  getDriverByOutcome,
  getOutcome,
  outcomeByCommand,
  updateOutcome,
} from "../utils/drivers";
import { createArrow } from "../utils/arrows";
import { createView, deleteView } from "../utils/views";
import { useNavigate } from "react-router";
import { useParams } from "react-router"; //to store state in the URL
import DriverCards from "../components/driverCards";
import { getUserData } from "../utils/auth";
import styles from "./DriverTreePage.module.css";
import OutcomeTable from "../components/OutcomeTable";
import ClusterModal from "../components/ClusterModal";
import { getArrows } from "../utils/arrows";
import ViewsTable from "../components/ViewsTable";
import { Xwrapper } from "react-xarrows";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const DriverTreePage = () => {
  const [state, setState] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [arrows, setArrows] = useState("");
  const [createAnArrow, setCreateAnArrow] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [PDFState, setPDFState] = useState(false);
  const [showArrowMod, setArrowMod] = useState(false);
  const [selOutcome, setSelOutcome] = useState({});
  const [driverTreeObj, setDriverTreeObj] = useState([]);
  const [showClusterModal, setClusterModal] = useState(false);
  const [selDriver, setSelDriver] = useState({});
  const [recordLockState, setRecordLockState] = useState(false); //used to lock the record when a user is editing it, reads the user's account permissions and adjusts record locks accordingly, stakeholders have read only access.
  const [viewId, setViewId] = useState(""); //used to let the user cycle through their personal views, the view state is the view id in case multiple users create same named views.
  const [loading, setLoading] = useState(true); //used to let the user cycle through their personal views, the view state is the view id in case multiple users create same named views.
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
    overFlowX: "hidden",
    // maxWidth: "100%",
  };

  const { outcomeId } = useParams();
  //custom styles for the divs down below

  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value

  let navigate = useNavigate();

  //using the initial useEffect hook to open up the driver trees and prefill the table at the bottom of the page
  useEffect(() => {
    const getAppData = async () => {
      if (!outcomeId) {
        await outcomeByCommand(state.stakeholderId).then((data) => {
          setSelOutcome(data.data[0]);
        });
      } else {
        await getOutcome(outcomeId).then((data) => {
          setSelOutcome(data.data);
        });    
      }
      await getDriverByOutcome(selOutcome.id).then((data) => {
        setDriverTreeObj(data.data);
      });
      await getArrows(selOutcome.id).then((data) => {
        setArrows(data.data);
      });
    };

    getUserData({ navigate, state, setState, outcomeId });
    getAppData();
    setLoading(false);

    if (state.userRole === "Stakeholder" || selOutcome.state === "Active") {
      setRecordLockState(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getInfo = async () => {
      if (!selOutcome.id) {
        selOutcome.id = outcomeId;
      }
      await getDriverByOutcome(selOutcome.id).then((data) => {
        setDriverTreeObj(data.data);
      });
      await getArrows(selOutcome.id).then((data) => {
        setArrows(data.data);
      });
    };

    getInfo();
    if (state.userRole === "Stakeholder" || selOutcome.state === "Active") {
      setRecordLockState(true);
    }
    navigate("/drivertree/" + selOutcome.id);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selOutcome]);

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
    if (window.confirm("Are you sure you want to delete this view?")) {
      await deleteView(viewId);
    } else {
      return;
    }
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
        if (width > 400) {
          width = 400;
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
        let svgleft = svgArray[index].getBoundingClientRect().left * 0.99;
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
      let options = {
        papersize: "auto",
        margin: "25px",
        landscape: true,
      };
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
    setCreateAnArrow(!createAnArrow);
  };

  const updateOpacity = (e) => {
    setOpacity(e.target.value / 100);
  };

  const makeActive = async () => {
    //changes the state of the outcome from Draft to Active
    if (!selOutcome.id) {
      alert(
        "Something went wrong.  Please refresh the page and try again.  If this error persists, please contact an administrator."
      );
      return;
    }
    updateOutcome(selOutcome.id, { State: "Active" });
  };

  const versionRoll = async () => {
    //this function will create a new version of the outcome and all drivers then update all of the views to the new version
    if (!selOutcome.id) {
      alert(
        "Something went wrong.  Please refresh the page and try again.  If this error persists, please contact an administrator."
      );
      return;
    }
    updateOutcome(selOutcome.id, { State: "Active" });
    let newOutcomeId = 0;
    let body = { stakeholderId: state.command, userId: state.userId };
    await createOutcome(body).then((data) => {
      body = selOutcome;
      body.version = selOutcome.version + 1;
      delete body.id;
      newOutcomeId = data.data.id;
      console.log(body);
      console.log(newOutcomeId);
      console.log(data.data);
      updateOutcome(data.data.id, body);
    });
    let driverBody = driverTreeObj;
    let arrowBody = arrows;

    for (let i = 0; i < driverBody.length; i++) {
      driverBody[i].outcomeId = newOutcomeId;
      //note here, the id is being deleted by the driver router so we dont need to do it here
      console.log(driverBody[i]);
      await createDriver(driverBody[i], state.userId).then((data) => {
        //now we look inside arrowBody for this id, if we find it, we replace it with the new id  This will allow us to create the arrows with the new ids
        //first we do the clusters, then we do the arrows as the arrows depend on both cluster and driver ids

        //now we cycle through the arrows  for cards only and update them.  We'll get to clusters in a bit
        for (let j = 0; j < arrowBody.length; j++) {
          arrowBody[j].outcomeId = newOutcomeId;
          if (
            arrowBody[j].start.startsWith("card") &&
            arrowBody[j].start.endsWith(JSON.stringify(driverBody[i].id))
          ) {
            arrowBody[j].start =
              arrowBody[j].start.slice(
                0,
                -JSON.stringify(driverBody[i].id).length
              ) + data.data.id;
          }
          if (
            arrowBody[j].end.startsWith("card") &&
            arrowBody[j].end.endsWith(JSON.stringify(driverBody[i].id))
          ) {
            arrowBody[j].end =
              arrowBody[j].end.slice(
                0,
                -JSON.stringify(driverBody[i].id).length
              ) + data.data.id;
          }
        }
      });
      //now we create the arrows from the arrowBody
    }
    for (let m = 0; m < arrowBody.length; m++) {
      //removal of UID is handled by the arrow router
      createArrow(arrowBody[m]);
    }
    //now that we've created all the drivers, we'll create the clusters.  we'll make a single new object of the drivers
    let newDriverTree = [];
    let oldClusterId = 0; //used to not make repeat db updates
    let newClusterId = 0; //used to not make repeat db updates
    let clusterObj = {};
    let selectedDrivers = [];
    //     getDriverByOutcome(newOutcomeId).then((data) => {
    //       newDriverTree = data.data;
    //       for (let i = 0; i < newDriverTree.length; i++) {
    //         if (newDriverTree[i].clusterId && newDriverTree[i].clusterId !== oldClusterId) {
    //           //this is the same old clusterID, we dont get a new one until after createCluster is called
    //           oldClusterId = newDriverTree[i].clusterId;
    //           for (let j = i; j < newDriverTree.length; j++) {
    //             if (data.data[j].clusterId === oldClusterId) {
    //               selectedDrivers.push(data.data[j]);
    //             } else {
    //               clusterObj = {
    //                 outcomeId: newOutcomeId,
    //                 selDriversArr: selectedDrivers,
    //               };
    //               // eslint-disable-next-line no-loop-func
    //               createCluster(clusterObj).then((res) => {
    //                 //this is the new cluster id; as id's can only grow this logic is fine
    //                 newClusterId = res.data.id;
    //                 j = driverBody.length;
    //               });
    // //now that we've created the new cluster, we need to update any arrows that point to the old cluster id
    //               for (let k = 0; k < arrowBody.length; k++) {
    //                 if (arrowBody[k].start.startsWith('tier') && arrowBody[k].start.endsWith(oldClusterId)) {
    //                   arrowBody[k].start = arrowBody[k].start.slice(0, -oldClusterId.length) + newClusterId;
    //                 }
    //                 if (arrowBody[k].end.startsWith('tier') && arrowBody[k].end.endsWith(oldClusterId)) {
    //                   arrowBody[k].start = arrowBody[k].start.slice(0, -oldClusterId.length) + newClusterId;
    //                 }
    //               }
    //             }
    //           }

    //         }
    //       }
    //     });
  };

  return (
    <>
      <div id="topleveldiv" key="topleveldiv" className={styles.driver_page}>
        {/* className={styles.driver_page}  */}
        <Container fluid className="justify-content-center">
          <div
            style={{ height: "40px", maxwidth: "100%" }}
            className="justify-content-center"
          >
            {state.userRole !== "Stakeholder" ? (
              <Col style={{ maxWidth: "1100px" }}>
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
                {state.userRole === "Administrator" &&
                selOutcome.state === "Active" ? (
                  <button
                    className={styles.dtree_btn}
                    onClick={() => versionRoll()}
                  >
                    Create Next Rev
                  </button>
                ) : null}
                {state.userRole === "Administrator" &&
                selOutcome.state === "Draft" ? (
                  <button
                    className={styles.dtree_btn}
                    onClick={() => makeActive()}
                  >
                    Make Active
                  </button>
                ) : null}
                <div>
                  Outcome Version: {selOutcome.version} Outcome State:{" "}
                  {selOutcome.state}
                </div>
              </Col>
            ) : (
              <Col>
                <button className={styles.dtree_btn} onClick={handleClick}>
                  Generate PDF
                </button>
              </Col>
            )}
          </div>
          <PDFExport ref={pdfExportComponent} paperSize="auto" margin={40}>
            <Row
              id="pdf-export"
              style={PDFState ? pdfStyle : showTable.driverStyle}
              className={styles.pdf_export}
            >
              <Xwrapper>
                {  !loading ?(
                  <DriverCards
                    arrows={arrows}
                    setArrows={setArrows}
                    driverTreeObj={driverTreeObj}
                    setDriverTreeObj={setDriverTreeObj}
                    cluster={clusters}
                    setClusters={setClusters}
                    createAnArrow={createAnArrow}
                    opacity={opacity}
                    setOpacity={setOpacity}
                    PDFState={PDFState}
                    recordLockState={recordLockState}
                    state={state}
                    setCreateAnArrow={setCreateAnArrow}
                    setArrowMod={setArrowMod}
                    selOutcome={selOutcome}
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
                ): null}
              </Xwrapper>
            </Row>
          </PDFExport>
          <div style={showTable.tableStyle}>
            {state.command && tableState === "outcome" ? (
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
            driverTreeObj={driverTreeObj}
            setDriverTreeObj={setDriverTreeObj}
            selDriver={selDriver}
            setSelDriver={setSelDriver}
            selOutcome={selOutcome}
            setSelOutcome={setSelOutcome}
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
