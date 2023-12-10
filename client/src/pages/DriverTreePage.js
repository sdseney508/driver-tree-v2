//page for viewing and updating op limits
import React, { useState, useContext, useEffect, useRef } from "react";
import { stateContext } from "../App";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import html2canvas from "html2canvas";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import {
  createOutcome,
  getOutcome,
  outcomeByCommand,
  getDriverByOutcome,
} from "../utils/drivers";
// import { getViewCards } from "../utils/viewCards";
// import { getViewArrows } from "../utils/viewArrows";
import { createView, deleteView } from "../utils/views";
import { addViewArrow, getViewArrows } from "../utils/viewArrows";
import { getArrows } from "../utils/arrows";
import { useNavigate } from "react-router";
import { useParams } from "react-router"; //to store state in the URL
import DriverCards from "../components/driverCards";
import { getAppData } from "../utils/auth";
import styles from "./DriverTreePage.module.css";
import OutcomeTable from "../components/OutcomeTable";
import ClusterModal from "../components/ClusterModal";
// import ArrowModal from "../components/ArrowModal";
import ModArrows from "../components/ModArrows";
import { exportElement } from "../utils/export-element";
import ViewsTable from "../components/ViewsTable";
import { Xwrapper } from "react-xarrows";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const DriverTreePage = () => {
  const [state, setState] = useContext(stateContext);
  const [arrowID, setArrowID] = useState("");
  const [clusters, setClusters] = useState([]);
  const [createArrow, setCreateArrow] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [PDFState, setPDFState] = useState(false);
  const [showClusterModal, setClusterModal] = useState(false);
  const [showArrowModal, setArrowModal] = useState(false);
  const [showArrowMod, setArrowMod] = useState(false);
  const [selOutcome, setSelOutcome] = useState({});
  const [selDriver, setSelDriver] = useState({});
  const [driverTreeObj, setDriverTreeObj] = useState([]);
  const [recordLockState, setRecordLockState] = useState(false); //used to lock the record when a user is editing it, reads the user's account permissions and adjusts record locks accordingly, stakeholders have read only access.
  const [viewId, setViewId] = useState(""); //used to let the user cycle through their personal views, the view state is the view id in case multiple users create same named views.
  const [viewObj, setViewObj] = useState([]); //used to store the view object for the view cards
  const [viewArrows, setViewArrows] = useState([]); //used to store the view arrows for the view cards
  const [tableState, setTableState] = useState("outcome"); //used to toggle the table at the bottom of the page. const [connectionShow, setConnectionShow] = useState(false);

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

  //these are the state and URL for the pdf
  const { outcomeId } = useParams();
  const [arrows, setArrows] = useState([]);
  //custom styles for the divs down below

  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value

  let navigate = useNavigate();

  //using the initial useEffect hook to open up the driver trees and prefill the table at the bottom of the page
  useEffect(() => {
    getAppData(
      navigate,
      state,
      setState,
      outcomeId,
      outcomeByCommand,
      setSelOutcome,
      getOutcome,
      getDriverByOutcome,
      setDriverTreeObj,
      viewId,
      setViewId
    );
    setState({ ...state, selOutcome: selOutcome });
    if (state.Role === "Stakeholder") {
      setRecordLockState(true);
    }
    console.log("DriverTreePage initial useEffect");
  }, []);

  //this useeffect is there to refresh the driver tree elements whenever the selOutcome state is changed.
  useEffect(() => {
    const getDriversData = async (selOutcome) => {
      await getDriverByOutcome(selOutcome.id).then((data) => {
        setDriverTreeObj(data.data);
      });
      await getArrows(selOutcome.id).then((data) => {
        setArrows(data.data);
      });
      // await getViewCards(viewId).then((data) => {
      //   setViewObj(data.data);
      // });
      // await getViewArrows(viewId).then((data) => {
      //   setViewArrows(data.data);
      // });
    };
    getDriversData(selOutcome);
    setState({ ...state, selOutcome: selOutcome });
    navigate("/drivertree/" + selOutcome.id);
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
    console.log(tableState);
  };

  const goToDriver = async (e) => {
    e.preventDefault();
    navigate("/drpage/" + selOutcome.id + "/" + driverTreeObj[0].id);
  };

  //creates new outcome and then resets the selOutcome state.  This cause a a useEffect fire and refreshes the page.
  const newOutcome = async () => {
    let body = { command: state.command };
    createOutcome(body).then((data) => {
      setState({ ...state, outcomeId: data.data.id });
      setSelOutcome(data.data);
    });
  };

  //used to handle the submit of the modals for clusters and arrows
  const onModalSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };

  //close the modal
  const handleClose = () => {
    setClusterModal(false);
    setArrowModal(false);
    setArrowMod(false);
  };

  //apply the xmlns tag to all svgs
  const applyXmlns = () => {
    let svg = document.querySelectorAll("svg");
    let svgArray = Array.from(svg);
    const xmlns = "http://www.w3.org/2000/xmlns/";
    const xlinkns = "http://www.w3.org/1999/xlink";
    const svgns = "http://www.w3.org/2000/svg";
    //start at 1 the flag already has one
    for (let i = 2; i < svgArray.length; i++) {
      svgArray[i].setAttributeNS(xmlns, "xmlns", svgns);
      // svgArray[i].setAttributeNS(xmlns, "xmlns:xlink", xlinkns);
    }
  };

  //use canvg to turn all SVGs into PNGs
  const convertSvgToPng = async () => {
    // var content = document.getElementById("pdf-export");
    // applyXmlns();
    let svg = document.querySelectorAll("svg");
    let svgArray = Array.from(svg);
    //start at 1 the flag already has one
    console.log(svgArray.length);
    for (let i = 1; i < svgArray.length; i++) {
      console.log(svgArray[i].parentNode);
      console.log(svgArray[i].outerHTML);
      let svgBounds = svgArray[i].getBoundingClientRect();
      let svgWidth = svgBounds.width;
      let svgHeight = svgBounds.height;
      let svgString = svgArray[i].outerHTML;
      htmlToImage.toPng(svgArray[i]).then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        img.width = svgWidth;
        img.height = svgHeight;
        //now replace the svg with the png
        svgArray[i].parentNode.replaceChild(img, svgArray[i]);
        img.setAttribute("style", "position: relative; top: 0; left: 0");
        let carddiv = document.getElementById("tier1subTier1");
        carddiv.appendChild(img);
      });
    }
    
  };

  //used to clean the cards up for a PDF generation
  useEffect(() => {
    //needed to prevent a random pdf from generating on every page load
    if (PDFState && document.readyState === "complete") {
      // applyXmlns();
      convertSvgToPng();
      //first get all the svg elements, then convert them into pngs, then save them to a folder, then replace the svg with the png.
      let pdf = new jsPDF(
        'l'
      );

      let pdfExport = document.getElementById("pdf-export");
      exportElement(pdfExport, {}, selOutcome.outcomeTitle);
      // let svgelement = document.getElementById("SVG72");
      // console.log(svgelement.parentElement);
      // console.log(svgelement.parentNode);
      // svgelement.path.fill = "red";
      // html2canvas(pdfExport).then((canvas) => {
      //   //convert to an image data URL
      //   let imgData = canvas.toDataURL("image/png");
      //   const imgProps = pdf.getImageProperties(imgData);
      //   const pdfWidth = pdf.internal.pageSize.getWidth();
      //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      //   pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
      //   pdf.save(`${selOutcome.outcomeTitle}.pdf`);
      //   let svgstring = document.getElementById("SVG66").outerHTML;
      //   let svgstring1 = document.getElementById("SVG66").innerHTML;
      //   console.log(svgstring);
      //   console.log(svgstring1);

      // });
    } else if (PDFState && document.readyState !== "complete") {
      applyXmlns();
      // let svgstring = document.getElementById("SVG66").outerHTML;
      // let svgstring1 = document.getElementById("SVG66").innerHTML;
      // console.log(svgstring);
      // console.log(svgstring1);
      // let pdf = new jsPDF();
      let pdfExport = document.getElementsById("pdf-export");
      exportElement(pdfExport, {}, selOutcome.outcomeTitle);
      // html2canvas(pdfExport, { allowTaint: true }).then(function (canvas) {
      //   //convert to an image data URL
      //   var imgData = canvas.toDataURL("image/png");

      //   //add to pdf
      //   pdf.addImage(imgData, "PNG", 100, 100);
      //   pdf.save(`${selOutcome.outcomeTitle}.pdf`);
      // });
    }
    setPDFState(false);

    //then we push the arrows to the DOM so they can be exported
  }, [PDFState, selOutcome.outcomeTitle]);

  const handleClick = () => {
    setPDFState(true);
  };

  const toggleArrow = () => {
    setCreateArrow(!createArrow);
  };

  const pdfExportComponent = useRef(null);

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
          <Row
            id="pdf-export"
            style={PDFState ? pdfStyle : showTable.driverStyle}
            className={styles.pdf_export}
          >
            <Xwrapper>
              <DriverCards
                arrows={arrows}
                setArrows={setArrows}
                arrowID={arrowID}
                setArrowID={setArrowID}
                cluster={clusters}
                setClusters={setClusters}
                createArrow={createArrow}
                driverTreeObj={driverTreeObj}
                setDriverTreeObj={setDriverTreeObj}
                opacity={opacity}
                setOpacity={setOpacity}
                PDFState={PDFState}
                recordLockState={recordLockState}
                state={state}
                setCreateArrow={setCreateArrow}
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
            </Xwrapper>
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

            {state.userId && tableState === "view" ? (
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

      {/* for modifying arrows */}
      <Modal
        name="arrowModModal"
        show={showArrowMod}
        size="md"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setArrowMod(false)}
        // className={styles.cluster_modal}
      >
        <Modal.Header closeButton>
          <Modal.Title id="cluster-modal">Mod Arrow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*change everything in the signup form components*/}
          <ModArrows
            onModalSubmit={onModalSubmit}
            arrowID={arrowID}
            setArrowMod={setArrowMod}
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
