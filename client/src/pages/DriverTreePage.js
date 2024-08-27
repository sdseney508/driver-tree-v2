import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";
import {
  createDriver,
  createOutcome,
  getDriverByOutcome,
  getOutcome,
  updateOutcome,
} from "../utils/drivers";
import { createArrow } from "../utils/arrows";
import { addOutcomeDriver } from "../utils/outcomeDrivers";
import { createView, deleteView } from "../utils/views";
import {
  getStatusDefinitionByOutcome,
  modifyStatusDefinition,
} from "../utils/statusDefinition";
import { useNavigate } from "react-router";
import { useParams } from "react-router"; //to store state in the URL
import DriverCards from "../components/driverCards";
import { getUserData } from "../utils/auth";
import styles from "./DriverTreePage.module.css";
import OutcomeTable from "../components/OutcomeTable";
import ClusterModal from "../components/ClusterModal";
import { getArrows } from "../utils/arrows";
import ViewsTable from "../components/ViewsTable";
import { createCluster } from "../utils/cluster";
// import { exportElement } from "../utils/export-element";
import exportToPDF from "../utils/exportToPDF";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const DriverTreePage = () => {
  const apiCall = {
    columns: {
      "Tier-1": {
        id: "Tier-1",
        items: [],
      },
      "Tier-2": {
        id: "Tier-2",
        items: [],
      },
      "Tier-3": {
        id: "Tier-3",
        items: [],
      },
      "Tier-4": {
        id: "Tier-4",
        items: [],
      },
      "Tier-5": {
        id: "Tier-5",
        items: [],
      },
      "Tier-6": {
        id: "Tier-6",
        items: [],
      },
      // Add more columns as needed
    },
  };
  const [state, setState] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [error, setError] = useState(false);
  const [arrows, setArrows] = useState([]);
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

  let tableStyle = { height: "25vh", width: "100%", overFlowY: "scroll" };
  let driverStyle = {
    height: "60vh",
    overFlowY: "hidden",
    overFlowX: "hidden",
  }; //custom styles for the divs down below
  const [showTable, setShowTable] = useState({ tableStyle, driverStyle }); //show or not show the Outcomes/views tables at the bottom of the page
  const pdfStyle = {
    height: "fit-content",
    overFlowY: "visible",
    overFlowX: "hidden",
  };

  const { outcomeId } = useParams();
  //custom styles for the divs down below

  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value

  let navigate = useNavigate();

  //using the initial useEffect hook to open up the driver trees and prefill the table at the bottom of the page
  useEffect(() => {
    const getAppData = async (user) => {
      if (outcomeId === "0") {
        //there is no outcomeId, so we need to create a new outcome
        await newOutcome(user);
        // await outcomeByCommand(state.stakeholderId).then((data) => {
        //   setSelOutcome(data.data[0]);
        // });
      } else {
        await getOutcome(outcomeId).then((data) => {
          setSelOutcome(data.data);
        });
      }
      await getDriverByOutcome(selOutcome.id).then((data) => {
        setDriverTreeObj(data.data);
      });
      if (user.userRole === "Stakeholder" || selOutcome.state === "Active") {
        setRecordLockState(true);
      }
    };

    let user = getUserData({ navigate, state, setState, outcomeId });

    getAppData(user);
    authCheck();
    setTimeout(() => {
      setLoading(false);
    }, 150);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [, outcomeId]);

  useEffect(() => {
    setLoading(true);
    const getInfo = async () => {
      setRecordLockState(false);
      if (!selOutcome.id) {
        selOutcome.id = outcomeId;
      }
      //troubleshooting:  removed on 27 June 2024 at 1910 EST
      // await getOutcome(selOutcome.id).then((data) => {
      //   if (!data.data) {
      //     setError(true);
      //     navigate("/user");
      //     return;
      //   }
      // });
      await getDriverByOutcome(selOutcome.id).then((data) => {
        setDriverTreeObj(data.data);
      });
      await getArrows(selOutcome.id).then((data) => {
        setArrows(data.data);
      });

      if (state.userRole === "Stakeholder" || selOutcome.state === "Active") {
        await setRecordLockState(true);
      }
    };

    getInfo();
    if (state.command && selOutcome.stakeholderId) {
      authCheck(state.command, selOutcome.stakeholderId);
    }
    navigate("/drivertree/" + selOutcome.id);
    // if (driverTreeObj.length > 0) {
      setLoading(false);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selOutcome, viewId, opacity]);

  const authCheck = (command, stakeholder) => {
    //checks to see if the user has access to the desired outcome
    //first we grab the user data from state and the outcome data from the database then compare the user command with the outcoem stakeholder
    if (command !== stakeholder) {
      alert("You do not have access to this outcome in dtree page");
      navigate("/user");
    }
  };

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
      };
      setOpacity(100);
      setTableState("");
    } else if (table === "outcome") {
      tableStyle = { height: "25vh", width: "100%", overFlowY: "scroll" };
      driverStyle = {
        height: "60vh",
        overFlowY: "scroll",
      };
      setOpacity(100);
      setTableState("outcome");
    } else if (table === "view") {
      tableStyle = { height: "25vh", width: "350px", overFlowY: "scroll" };
      driverStyle = {
        height: "60vh",
        overFlowY: "scroll",
      };
      setTableState("view");
    }
    setShowTable({ tableStyle, driverStyle });
  };

  //creates new outcome and then resets the selOutcome state.  This cause a a useEffect fire and refreshes the page.
  const newOutcome = async (user) => {
    let body = { stakeholderId: state.command, userId: state.userId };
    if (!state.command) {
      body.stakeholderId = user.stakeholderId;
      body.userId = user.id;
    }
    //the status definitions are created on the server side, no need to create them here.
    await createOutcome(body).then((data) => {
      setState({ ...state, outcomeId: data.data.id });
      setSelOutcome(data.data);
    });
  };

  const svgForPdf = () => {
    //this function takes in an array of svgs from the arrows, pulls out the <path> and <g> elements, then creates a new svg element and appends the path and g elements to it.  it then returns the SVG element in a div for appending to the DOM.  The <div> element has an absolute position based on the position of the arrow svg element that is passed in as part of the entering arguement.
    //first we remove the first element in svgs
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
        let svgleft = svgArray[index].getBoundingClientRect().left - 50;
        console.log(svgArray[index].getBoundingClientRect());
        console.log(svgtop, svgleft);
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
      // let pdfExport = document.getElementById("pdf-export");
      // exportElement(pdfExport, options, selOutcome.outcomeTitle);
      exportToPDF("pdf-export");
      setTimeout(() => {
      window.location.reload()}, 250);
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
    updateOutcome(selOutcome.id, state.userId, { state: "Active"});
    window.location.reload();
  };

  const versionRoll = async () => {
    debugger;
    let statusDefBody = [];
    let oldstatusDefBody = [];
    //first we need to get all the status definitions for the current outcome
    //this function will create a new version of the outcome and all drivers then update all of the views to the new version
    if (!selOutcome.id) {
      alert(
        "Something went wrong.  Please refresh the page and try again.  If this error persists, please contact an administrator."
      );
      return;
    }

    let newOutcomeId = 0;
    let oldOutcomeId = selOutcome.id;
    let body = { stakeholderId: state.command, userId: state.userId };
    //first we create the new outcome, then we'll assign the same driver cards and arrows to it
    await createOutcome(body).then(async (data) => {
      body = JSON.parse(JSON.stringify(selOutcome));
      body.version = selOutcome.version + 1;
      body.state = "Draft";
      body.userId = state.userId;
      delete body.id;
      newOutcomeId = data.data.id;
      await updateOutcome(data.data.id, state.userId, body);
    });
    //now we update the statusdefinitions that were created on the server side.
    oldstatusDefBody = await getStatusDefinitionByOutcome(oldOutcomeId);
    statusDefBody = await getStatusDefinitionByOutcome(newOutcomeId);
    for (let i = 0; i < statusDefBody.data.length; i++) {
      statusDefBody.data[i].statusDefinition =
        oldstatusDefBody.data[i].statusDefinition;
      modifyStatusDefinition(statusDefBody.data[i].id, statusDefBody.data[i]);
    }
    //now we need to create the new drivers and clusters.  We'll start by creating the drivers, then we'll create the clusters, then we'll create the arrows, lastly we'll create the outcomeDrivers to associate the drivers with the outcome
    let driverBody = JSON.parse(JSON.stringify(driverTreeObj));
    let arrowBody = JSON.parse(JSON.stringify(arrows));
    delete arrowBody.id;
    delete driverBody.id;
    let oldClusterId = []; //used to not make repeat db updates
    let selectedDrivers = [];
    let clusterArr = "";
    let clusterName = "";
    let oldDriverId = "";
    //for the new driverTreeObj structure:  need to cycle through driverBody columns and drivers in each column
    for (let i = 0; i < driverBody.length; i++) {
      if (driverBody[i] !== null) {
        debugger;
        for (let j = 0; j < driverBody[i].length; j++) {
          driverBody[i][j].outcomeId = newOutcomeId;
          driverBody[i][j].modified = "No";
          oldDriverId = driverBody[i][j].driverId;
          delete driverBody[i][j].outcomeDrivers.driverId;
          const driverData = await createDriver(driverBody[i][j], state.userId);
          let body = {
            outcomeId: newOutcomeId,
            driverId: driverData.data.id,
            tierLevel: driverBody[i][j].tierLevel,
            subTier: driverBody[i][j].subTier,
            userId: state.userId,
          };
          console.log(body);
          let outcomeD = await addOutcomeDriver(body);
          //check to see if it is in a cluster
          if (driverBody[i][j].clusterId) {
            if (!clusterName) {
              clusterName = driverBody[i][j].cluster.clusterName;
            }
            //check to see if it is first driver in a new cluster
            if (driverBody[i][j].clusterId !== oldClusterId) {
              //check to see if there are any drivers in the selectedDrivers array from a prior cluster, if there are create a new cluster in the database tied to the new outcome
              if (selectedDrivers.length > 0) {
                //we need to create a new cluster from the current selectedDrivers array, then reset the array
                body = {
                  outcomeId: newOutcomeId,
                  clusterName: clusterName,
                  selDriversArr: selectedDrivers,
                };
                const clusterData = await createCluster(body);
                clusterArr = clusterData.data.id;
                for (let j = 0; j < arrowBody.length; j++) {
                  if (
                    arrowBody[j].start.startsWith("tier") &&
                    arrowBody[j].start.endsWith("r" + oldClusterId)
                  ) {
                    arrowBody[j].start =
                      arrowBody[j].start.slice(
                        0,
                        -JSON.stringify(oldClusterId).length
                      ) + JSON.stringify(clusterArr);
                  }
                  if (
                    arrowBody[j].end.startsWith("tier") &&
                    arrowBody[j].end.endsWith(
                      "r" + JSON.stringify(oldClusterId)
                    )
                  ) {
                    arrowBody[j].end =
                      arrowBody[j].end.slice(
                        0,
                        -JSON.stringify(oldClusterId).length
                      ) + JSON.stringify(clusterArr);
                  }
                }
                //reset the cluster array
                selectedDrivers = [];
              }
              //if it is, we need to update the cluster id to the new cluster id
              selectedDrivers.push(driverData.data);
              oldClusterId = driverBody[i][j].clusterId;
              clusterName = driverBody[i][j].cluster.clusterName;
            } else {
              //the driver is in the same cluster as the previous driver, so we need to add it to the array
              selectedDrivers.push(driverData.data);
              oldClusterId = driverBody[i][j].clusterId;
              //now we look inside arrowBody for this id, if we find it, we replace it with the new id  This will allow us to create the arrows with the new ids
            }
          }

          if (i === driverBody.length - 1 && selectedDrivers.length > 0) {
            //create the cluster, the driver is the last one in the arrray and cluster.

            if (clusterName) {
              body = {
                outcomeId: newOutcomeId,
                clusterName: clusterName,
                selDriversArr: selectedDrivers,
              };
            } else {
              body = {
                outcomeId: newOutcomeId,
                selDriversArr: selectedDrivers,
              };
            }
            const clusterD = await createCluster(body);

            clusterArr = clusterD.data.id;
            for (let j = 0; j < arrowBody.length; j++) {
              if (
                arrowBody[j].start.startsWith("tier") &&
                arrowBody[j].start.endsWith(
                  "cluster" + JSON.stringify(oldClusterId)
                )
              ) {
                arrowBody[j].start =
                  arrowBody[j].start.slice(
                    0,
                    -JSON.stringify(oldClusterId).length
                  ) + JSON.stringify(clusterArr);
              }
              if (
                arrowBody[j].end.startsWith("tier") &&
                arrowBody[j].end.endsWith(
                  "cluster" + JSON.stringify(oldClusterId)
                )
              ) {
                arrowBody[j].end =
                  arrowBody[j].end.slice(
                    0,
                    -JSON.stringify(oldClusterId).length
                  ) + JSON.stringify(clusterArr);
              }
            }
          }
          //now we cycle through the arrows for cards and outcome and update them.
          for (let j = 0; j < arrowBody.length; j++) {
            delete arrowBody[j].id;
            arrowBody[j].outcomeId = newOutcomeId;
            if (
              arrowBody[j].start.startsWith("card") &&
              arrowBody[j].start.endsWith("d" + oldDriverId)
            ) {
              arrowBody[j].start =
                arrowBody[j].start.slice(0, -oldDriverId.toString().length) +
                driverData.data.id;
            }
            if (
              arrowBody[j].end.startsWith("card") &&
              arrowBody[j].end.endsWith("d" + oldDriverId)
            ) {
              arrowBody[j].end =
                arrowBody[j].end.slice(0, -oldDriverId.toString().length) +
                driverData.data.id;
            }
            if (arrowBody[j].end === "outcomeId" + oldOutcomeId) {
              arrowBody[j].end =
                arrowBody[j].end.slice(
                  0,
                  -JSON.stringify(oldOutcomeId).length
                ) + JSON.stringify(newOutcomeId);
            }
          }
        }
      }
    }
    for (let m = 0; m < arrowBody.length; m++) {
      //removal of UID is handled by the arrow router
      await createArrow(arrowBody[m]);
    }
    getOutcome(newOutcomeId).then((data) => {
      setSelOutcome(data.data);
    });

    navigate("/drivertree/" + newOutcomeId);
    //now that we've created all the drivers, we'll create the clusters.  we'll make a single new object of the drivers
  };

  return (
    <>
      {!error ? (
        // <Container fluid className="justify-content-center">
        <Row id="topleveldiv" key="topleveldiv" className={styles.outer_div}>
          <Row style={{ height: "40px" }} className="justify-content-center">
            {state.userRole !== "Stakeholder" ? (
              <Col>
                <button
                  className={styles.dtree_btn}
                  onClick={() => {
                    handleClick();
                  }}
                >
                  Generate PDF
                </button>
                <button className={styles.dtree_btn} onClick={newOutcome}>
                  New Outcome
                </button>
                {selOutcome.state === "Draft" ? (
                  <button
                    className={styles.dtree_btn}
                    onClick={() => setClusterModal(true)}
                  >
                    Create Cluster
                  </button>
                ) : null}
                {selOutcome.state === "Draft" ? (
                  <button
                    className={styles.dtree_btn}
                    onClick={() => toggleArrow()}
                  >
                    Create Arrow
                  </button>
                ) : null}
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
                Outcome Version: {selOutcome.version} &nbsp; &nbsp; &nbsp;
                &nbsp; Outcome State: &nbsp; &nbsp;
                {selOutcome.state}
              </Col>
            ) : (
              <Col>
                <button className={styles.dtree_btn} onClick={handleClick}>
                  Generate PDF
                </button>
              </Col>
            )}
          </Row>
          <Row
            id="pdf-export"
            style={PDFState ? pdfStyle : showTable.driverStyle}
            className={styles.pdf_export}
          >
            {!loading ? (
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
            ) : <div>Hi</div>}
          </Row>

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
        </Row>
      ) : // </Container>
      null}
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
            setDriverTreeObj={setDriverTreeObj}
            selDriver={selDriver}
            setClusterModal={setClusterModal}
            setSelDriver={setSelDriver}
            selOutcome={selOutcome}
            setSelOutcome={setSelOutcome}
            state={state}
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
