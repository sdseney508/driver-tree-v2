//page for viewing and updating op limits
import React, { useState, useContext, useEffect, useRef } from "react";
import { stateContext } from "../App";
import canvg from "canvg";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import {
  createOutcome,
  getOutcome,
  outcomeByCommand,
  getDriverByOutcome,
} from "../utils/drivers";
import { createView, getView, updateView } from "../utils/views";
import { getArrows } from "../utils/arrows";
import { useNavigate } from "react-router";
import { useParams } from "react-router"; //to store state in the URL
import DriverCards from "../components/driverCards";
import { getAppData } from "../utils/auth";
import styles from "./DriverTreePage.module.css";
import OutcomeTable from "../components/OutcomeTable";
import ClusterModal from "../components/ClusterModal";
import ArrowModal from "../components/ArrowModal";
import ModArrows from "../components/ModArrows";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { exportElement } from "../utils/export-element";
import ViewsTable from "../components/ViewsTable";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const PDFExp = () => {
  const [state, setState] = useContext(stateContext);
  const [arrows, setArrows] = useState([]);
  const [arrowID, setArrowID] = useState();
  const [clusters, setClusters] = useState([]);
  const [createArrow, setCreateArrow] = useState(false);
  const [PDFState, setPDFState] = useState(false);
  const [showArrowMod, setArrowMod] = useState(false);
  const [selOutcome, setSelOutcome] = useState({});
  const [selDriver, setSelDriver] = useState({});
  const [driverTreeObj, setDriverTreeObj] = useState([]);

  const pdfStyle = { height: 'fit-content', overFlowY: "visible", overFlowX: "visible" };

  //these are the state and URL for the pdf
  const { outcomeId } = useParams();
let v;

  let tableStyle; //custom styles for the divs down below
  let driverStyle; //custom styles for the divs down below
  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value

  let navigate = useNavigate();

  //using the initial useEffect hook to open up the driver trees and prefill the table at the bottom of the page
  useEffect( async () => {
    getAppData(
      navigate,
      state,
      setState,
      outcomeId,
      outcomeByCommand,
      setSelOutcome,
      getOutcome,
      getDriverByOutcome,
      setDriverTreeObj
    );
      //convert the SVGs to PNGs
      //await convertSvgToPng(svgString, (pngFile) => {  

      //then make the PDF

    setState({ ...state, selOutcome: selOutcome });
  }, []);


  return (
    <>
      <div id="topleveldiv" key="topleveldiv" className={styles.driver_page}>
      {/* className={styles.driver_page}  */}
        <Container
          fluid className='justify-content-center'>
          <div
            id="pdf-export"
            style={ pdfStyle }
            className={styles.pdf_export}
          >
            {/* className={styles.my_row} */}
            <DriverCards
              arrowID={arrowID}
              arrows={arrows}
              cluster={clusters}
              setClusters={setClusters}
              createArrow={createArrow}
              driverTreeObj={driverTreeObj}
              PDFState={PDFState}
              state={state}
              selDriver={selDriver}
              setCreateArrow={setCreateArrow}
              setSelDriver={setSelDriver}
              setArrowID={setArrowID}
              setArrowMod={setArrowMod}
              setArrows={setArrows}
              selOutcome={selOutcome}
              setSelOutcome={setSelOutcome}
              showArrowMod={showArrowMod}
            />
          </div>
        </Container>
      </div>
   
    </>
  );
};

export default PDFExp;
