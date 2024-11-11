import React, { useEffect, useState, useRef } from "react";
import { Col, Card, Row, Button, Form, Modal } from "react-bootstrap";
import { Xwrapper } from "react-xarrows"; //for the arrows
import { deleteArrow } from "../utils/arrows";
import styles from "../pages/DriverTreePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faCircle, faTree } from "@fortawesome/free-solid-svg-icons";
import { faFlagUsa } from "@fortawesome/free-solid-svg-icons";
import Legend from "../components/legend";
import { useNavigate } from "react-router";
import {
  bulkDriverStatusUpdate,
  deleteDriver,
  getDriverByOutcome,
  getOutcome,
  updateDriver,
  updateOutcome,
  updateOutcomeDriver,
} from "../utils/drivers";
import { getArrows } from "../utils/arrows";
import { addViewCard, getViewCards, removeViewCard } from "../utils/viewCards";
import {
  addViewArrow,
  getViewArrows,
  removeViewArrow,
} from "../utils/viewArrows";
// import ClusterModal from "../components/ClusterModal";
import { updateArrow } from "../utils/arrows";
import { deleteCluster, updateCluster } from "../utils/cluster";
import DriverArrows from "./DrawArrows";
import TierModal from "./TierModal";
import { CreateAnArrow } from "./ArrowFunction";
import ModArrows from "../components/ModArrows";
import DriverModal from "./DriverrModal";
import { removeOutcomeDriver } from "../utils/outcomeDrivers";

const DriverCards = ({
  arrows,
  setArrows,
  clusterArray,
  setClusterArray,
  createAnArrow,
  cluster,
  createACluster,
  driverTreeObj,
  setDriverTreeObj,
  opacity,
  setOpacity,
  PDFState,
  recordLockState,
  setCreateAnArrow,
  selOutcome,
  setSelOutcome,
  state,
  tableState,
  viewId,
  viewObj,
  setViewObj,
  viewArrows,
  setViewArrows,
  legendState,
}) => {
  //This module has four functions:
  //1.  It creates the divs that go into the driver tree columns
  //2.  It creates the individual cards in the correct divs
  //3.  It houses the drag and drop functionality for the cards.  this requires the use of the onDragOver, onDragStart, draggable, and onDrop properties in the divs and cards
  //4.  Draws the correct clusters around the selected drivers based on the cluster field in the drivers table
  //The arrow function is contained in the arrows.js module.  It creates the arrows that connect the cards
  let navigate = useNavigate();
  const cardRefs = useRef({}); //so i can use the dataset assigned to each card to determine the tier and subTier of the card even druing a refresh
  const [arrowID, setArrowID] = useState("");
  const [selectedElements, setSelectedElements] = useState([]);
  const [tierModal, setTierModal] = useState(false);
  const [showClusterModal, setShowClusterModal] = useState(false);
  const [show, setShow] = useState(false);
  const [connectionShow, setConnectionShow] = useState(false);
  const [showArrowMod, setArrowMod] = useState(false);
  const [, setArrowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createDriverModal, setCreateDriverModal] = useState(false);
  const [driverTier, setDriverTier] = useState("");
  const [clusterTier, setClusterTier] = useState(""); //initial value for clsuterTier, used in the MakeCluster function to determine which tier to put a new cluster if they select cards from multiple tiers.

  useEffect(() => {
    const getDriversData = async (selOutcome, viewId) => {
      if (viewId) {
        await getViewCards(viewId).then((data) => {
          setViewObj(data.data);
        });
      }
      if (viewId) {
        await getViewArrows(viewId).then((data) => {
          setViewArrows(data.data);
        });
      }
    };
    getDriversData(selOutcome, viewId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opacity, viewId]);

  useEffect(() => {
    const updateTheArrows = async () => {
      await getArrows(selOutcome.id).then((data) => {
        setArrows(data.data);
      });
    };
    updateTheArrows();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverTreeObj]);

  //waits for setSelectedElements to be updated, then calls the CreateAnArrow function to create the arrow
  useEffect(() => {
    //first section determines if either the starting or ending arrow is a cluster.  uses the Modal to ask the user if they want to connect to the cluster or the driver then changes the appropriate selectedElement.cluster to 0 using the handle select function
    //needed for initial render
    if (selectedElements.length === 0) {
      return;
    } else if (selectedElements.length === 1) {
      if (!selectedElements[0].outcomeTitle && selectedElements[0].clusterId) {
        setShow(true);
        return;
      }
    } else if (selectedElements.length === 2) {
      //pop the second element in the array in case the user accidentally clicked twice, otherwise, proceed as normal.
      if (
        selectedElements[0].id === selectedElements[1].id &&
        !selectedElements[0].outcomeTitle &&
        !selectedElements[1].outcomeTitle
      ) {
        selectedElements.pop();
        return;
      } else if (selectedElements[1].clusterId) {
        setShow(true);
      } else {
        CreateAnArrow({
          setCreateAnArrow,
          selectedElements,
          selOutcome,
          setSelOutcome,
        });
        setSelectedElements([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedElements]);

  const addArrowToView = async () => {
    setConnectionShow(false);
    let body = { viewId: viewId, arrowId: arrowID };
    let arrowCheck = viewArrows.findIndex((v) => v.arrowId == arrowID);
    if (arrowCheck === -1) {
      await addViewArrow(body);
    } else {
      await removeViewArrow(body);
    }
    await getViewArrows(viewId).then((data) => {
      setViewArrows(data.data);
    });
    let val;
    if (opacity < 25) {
      val = opacity + 0.01;
    } else if (opacity >= 25) {
      val = opacity - 0.01;
    }
    setOpacity(val);
  };

  //used with the cluster-mod-modal to add cards to the cluster selected
  const addToThisCluster = async () => {
    //create a body with these values for each driver in the selectedElements array
    //todo:  make this a single bulk update
    let subTier = clusterArray[clusterArray.length - 1].subTier;

    //figure out how far down to shift the other cards in the cluster
    let shift = clusterArray.length - 1;

    for (let i = 0; i < clusterArray.length - 1; i++) {
      subTier++;
      let body = {
        tierLevel: clusterArray[clusterArray.length - 1].tierLevel,
        clusterId: clusterArray[clusterArray.length - 1].clusterId,
        subTier: subTier,
        modified: "Yes",
      };

      await updateOutcomeDriver(
        selOutcome.id,
        clusterArray[i].driverId,
        state.userId,
        body
      );
      await updateDriver(clusterArray[i].driverId, state.userId, body);
    }
    let clusterIDCheck = clusterArray[clusterArray.length - 1].clusterId;
    //now move all the other ones out of the way
    let tempTree = await getDriverByOutcome(selOutcome.id);
    tempTree = tempTree.data;
    //now we need to update the subTiers on the remainder of the cards in the tier column so nothing gets overlapped.  This will be done by looking at all the cards in the tier column with a subTier less than the length of the cluster + the subTier of the first card.  for all of these drivers, we'll add the subTier value to their subtier then update.
    //first we need to find the subTier of the last card in the cluster

    let firstSubTier = null;
    let count = 0;

    for (let subArray of driverTreeObj) {
      if (!Array.isArray(subArray)) continue; // Skip thw null or non-array elements like the Tier 0
      for (let driver of subArray) {
        if (
          driver.clusterId ===
            clusterArray[clusterArray.length - 1].clusterId &&
          driver.subTier > clusterArray[clusterArray.length - 1].subTier
        ) {
          //move this down the minimum number of spots to make room for the cluster
          updateOutcomeDriver(selOutcome.id, driver.driverId, state.userId, {
            subTier: driver.subTier + shift,
          });
        }
      }
    }

    for (let i = 0; i < tempTree[clusterArray[0].tierLevel].length; i++) {
      if (
        tempTree[clusterArray[0].tierLevel][i].subTier >= firstSubTier &&
        tempTree[clusterArray[0].tierLevel][i].clusterId !== clusterIDCheck
      ) {
        //move it down the minimum number of spots to make room for the cluster, so first calculate the number of spots needed to move it down
        let shift = clusterArray.length - 1; //move things by the number of added cards

        let body = {
          subTier: tempTree[clusterArray[0].tierLevel][i].subTier + shift,
        };
        await updateOutcomeDriver(
          selOutcome.id,
          tempTree[clusterArray[0].tierLevel][i].driverId,
          state.userId,
          body
        );
      }
    }
    window.location.reload();
  };

  function allowDrop(e) {
    //this property gets set on the individual divs onDragOver property to limit where a card can be dropped
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  async function ArrowModal(e, arrowId, tableState) {
    e.preventDefault();
    await setArrowID(arrowId);
    if (tableState === "view") {
      setConnectionShow(true);
    } else {
      setArrowMod(true);
    }
  }

  const cascadeUpdate = async (arrows, cardid, tier, newStatus) => {
    //this function cascades the updates to future driver cards in the driver card chain.  the first thing it does is check if the card is inside a cluster.  next it finds all the arrows that have the current card or it's clusteras a start point.  then it finds all the cards that have those arrows as startpoints and puts them into an updateArray.  Next we update those cards, then look for all arrows with those cards as start points and repeat until we hit the Outcome Card.
    //find all the arrows that have the current card as a start point
    //first check to see if the card is in a cluster
    //for loop based on tier of the driver card
    let updateArr = [cardid];
    let arrayCounter = 1; //this gets updated as we go through the updateArr for the subsequent tiers so we only go through new updateArr additions and dont end up in a continuous loop
    let loopEnd;
    let startP;
    let body = { status: newStatus };
    //initialize the update array with the current card.  the update array will be used to update all the cards in the chain and will be changed on every iteration of the tier for loop
    //flatten the drvierTreeObj so we can search it for the clusterId
    let flatDriverTree = driverTreeObj.flat();
    for (let i = tier; 1 < i; i--) {
      let clustCheck = 0;
      //either look at just the card cause you're in the first loop, or you need to search through the remainder of the updateArr beginning at where the last loop left off
      if (i === tier) {
        //this is the first loop, so we need to look at the card
        for (let k = 0; k < arrows.length; k++) {
          //if it is in a cluster, we need to find all the arrows that have the cluster as a start point
          //the below string literal is based on how cluster info is passed to the arrows model.  refer to either the arrows model start or end with a cluster already made for an example or look at driverCards.js tierCards function for naming format.
          //first we flatten the driver tree obj
          //first check driverTreeObj to see if the card is in a cluster

          for (let m = 1; m < flatDriverTree.length; m++) {
            if (flatDriverTree[m].driverId == cardid && clustCheck == 0) {
              clustCheck = m;
              m = flatDriverTree.length;
            }
          }
          // the below looks at id the card is in a cluster, so we need to find all the arrows that have the cluster as a start point
          if (flatDriverTree[clustCheck].clusterId) {
            startP = `tier${i}cluster${flatDriverTree[clustCheck].clusterId}`;
          }
          if (
            arrows[k].start === startP ||
            arrows[k].start === `card${updateArr[0]}`
          ) {
            let endPoint = arrows[k].end;
            if (endPoint.includes("cluster")) {
              //we need to find all the cards in the cluster and update them
              let clusterId = endPoint.slice(12);
              //this will produce an array of driver cards that we will update using the updateDriver function
              for (let cl = 1; cl < flatDriverTree.length; cl++) {
                if (flatDriverTree[cl].clusterId == clusterId) {
                  updateArr.push(flatDriverTree[cl].outcomeDrivers.driverId);
                }
              }
            } else {
              //the endpoint is not a cluster, so we need to update the card
              let cId;
              if (endPoint.includes("card")) {
                cId = endPoint.slice(4);
              } else {
                cId = endPoint.slice(9);
              }
              //push to the update Array so we can go on to the next tier evaluation
              updateArr.push(cId);
            }
          }

          loopEnd = updateArr.length;
        }
      } else {
        let clustCheck = 0;
        //this is not the first loop, so we need to look at the updateArr
        for (let j = arrayCounter; j < loopEnd; j++) {
          arrayCounter++;

          //we need to find all the arrows that have the card as a start point
          for (let k = 0; k < arrows.length; k++) {
            //if it is in a cluster, we need to find all the arrows that have the cluster as a start point
            //the below string literal is based on how cluster info is passed to the arrows model.  refer to either the arrows model start or end with a cluster already made for an example or look at driverCards.js tierCards function for naming format.
            //first check driverTreeObj to see if the card is in a cluster

            for (let n = 1; n < flatDriverTree.length; n++) {
              if (
                flatDriverTree[n].driverId == updateArr[j] &&
                clustCheck == 0
              ) {
                clustCheck = n;
                n = flatDriverTree.length;
              }
            }
            if (clustCheck !== 0 && flatDriverTree[clustCheck].clusterId) {
              startP = `tier${i}cluster${flatDriverTree[clustCheck].clusterId}`;
            }
            //the card is in a cluster, so we need to find all the arrows that have the cluster as a start point
            if (
              arrows[k].start === startP ||
              arrows[k].start === `card${updateArr[j]}`
            ) {
              //the arrow has a start point that is valid, so we need to look at the endpoint of the arrow, beginning with finding out if the endpoint is a cluster.  if it is a cluster, we do a database call and update all cards in the cluster.  if it is not a cluster, we update the card.
              let endPoint = arrows[k].end;
              if (endPoint.includes("cluster")) {
                //we need to find all the cards in the cluster and update them
                let clusterId = endPoint.slice(12);
                //this will produce an array of driver cards that we will update using the updateDriver function
                for (let cl = 1; cl < flatDriverTree.length; cl++) {
                  if (flatDriverTree[cl].clusterId == clusterId) {
                    updateArr.push(driverTreeObj[cl].outcomeDrivers.driverId);
                  }
                }
              } else {
                //the endpoint is not a cluster, so we need to update the card
                let cId;
                if (endPoint.includes("card")) {
                  cId = endPoint.slice(4);
                  //the else is in case the card is the outcome
                } else {
                  cId = endPoint.slice(9);
                }
                //push to the update Array so we can go on to the next tier evaluation
                updateArr.push(cId);
              }
            }
          }
        }
        loopEnd = updateArr.length;
      }
    }
    let ids = [];
    //now update every driver in the updateArr
    for (let i = 0; i < updateArr.length; i++) {
      ids.push(updateArr[i]);
    }
    body = { status: newStatus, ids: ids };
    bulkDriverStatusUpdate(body);

    //now update the outcome
    let outcomeBody = { status: newStatus, userId: state.userId };
    await updateOutcome(selOutcome.id, state.userId, outcomeBody);
    let updatedoutcome = await getOutcome(selOutcome.id);
    setSelOutcome(updatedoutcome.data);
  };

  const createNewDriver = async (e) => {
    e.preventDefault();
    setDriverTier(e.target.dataset.tierlevel);
    setCreateDriverModal(true);
  };

  //used in the Tier cards to create the driver cards for both the regular and the cluser
  const DCards = (cardData, tierLevel, viewCheck) => {
    const isSelectedForCluster = clusterArray.some(
      (item) => item.driverId === cardData.driverId
    );

    const isSelectedForArrow = selectedElements.some(
      (item) => item.driverId === cardData.driverId
    );

    return (
      <Card
        className={styles.my_card}
        ref={(el) => {
          cardRefs.current[cardData.driverId] = el;
        }}
        id={"card" + cardData.driverId}
        data-cardid={cardData.driverId}
        data-tierlevel={tierLevel}
        data-subtier={cardData.subTier}
        data-cluster={cardData.clusterId}
        key={"card" + cardData.driverId}
        draggable="true"
        onDragStart={useDrag}
        style={
          viewCheck !== -1
            ? cardData.modified === "No"
              ? { opacity: 1, boxShadow: "0 4px 8px 0 rgba(82, 81, 81)" }
              : { opacity: 1, boxShadow: "0 4px 8px 0 rgba(59, 46, 241)" }
            : cardData.modified === "No"
            ? { opacity: opacity, boxShadow: "0 4px 8px 0 rgba(82, 81, 81)" }
            : { opacity: opacity, boxShadow: "0 4px 8px 0 rgba(59, 46, 241)" }
        }
      >
        <Card.Body
          className={styles.card_body}
          data-cluster={cardData.clusterNumber}
        >
          <Row className={styles.card_row}>
            <Col className={styles.card_col_abbrev}>
              <Form className={styles.abbreviation_div}>
                <Form.Control
                  as="input"
                  name="stakeholderAbbreviation"
                  data-cardid={cardData.driverId}
                  className={styles.abbreviation_input}
                  defaultValue={cardData.stakeholderAbbreviation || "-"}
                  disabled={recordLockState}
                  onBlur={handleFormSubmit}
                />
              </Form>
              {!PDFState && !recordLockState ? (
                <div
                  onClick={delDriver}
                  data-cardid={cardData.driverId}
                  className={styles.del_div}
                >
                  Del
                </div>
              ) : null}
            </Col>
            <Col className={styles.card_col_body} id={cardData.driverId}>
              <div>
                {PDFState ? (
                  <div className={styles.my_card_text_pdf}>
                    {cardData.problemStatement}
                  </div>
                ) : recordLockState ? (
                  <div className={styles.my_card_text}>
                    {cardData.problemStatement}
                  </div>
                ) : (
                  <Form>
                    <Form.Control
                      as="textarea"
                      data-cardid={cardData.driverId}
                      className={styles.my_card_text}
                      defaultValue={cardData.problemStatement}
                      //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                      name="problemStatement"
                      onBlur={handleFormSubmit}
                    />
                  </Form>
                )}
              </div>
              <div></div>
            </Col>

            {!recordLockState ? (
              <Form>
                <Form.Control
                  as="select"
                  id="status"
                  data-cardid={cardData.driverId}
                  value={cardData.status}
                  className={
                    cardData.status === "Green"
                      ? styles.green_status
                      : cardData.status === "Yellow"
                      ? styles.yellow_status
                      : cardData.status === "Red"
                      ? styles.red_status
                      : styles.blue_status
                  }
                  //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                  name="status"
                  onChange={handleFormSubmit}
                >
                  <option
                    key={1}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "green",
                    }}
                  >
                    Green
                  </option>
                  <option
                    key={2}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "yellow",
                    }}
                  >
                    Yellow
                  </option>
                  <option
                    key={3}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "red",
                    }}
                  >
                    Red
                  </option>
                  <option
                    key={4}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "blue",
                    }}
                  >
                    Blue
                  </option>
                </Form.Control>
              </Form>
            ) : (
              <div>
                <FontAwesomeIcon
                  className={
                    cardData.status === "Green"
                      ? styles.green_status
                      : cardData.status === "Yellow"
                      ? styles.yellow_status
                      : cardData.status === "Red"
                      ? styles.red_status
                      : styles.blue_status
                  }
                  icon={faCircle}
                />
              </div>
            )}

            {PDFState === false ? (
              <div
                className={styles.details}
                onClick={goToDriver}
                data-cardid={cardData.driverId}
              >
                details
              </div>
            ) : null}
            {PDFState === false && cardData.embeddedOutcomeId !== 0 ? (
              <div
                className={styles.dtree_icon}
                data-outcomeid={cardData.embeddedOutcomeId}
              >
                <FontAwesomeIcon
                  icon={faTree}
                  data-outcomeid={cardData.embeddedOutcomeId}
                  onClick={() => goToDriverTree(cardData.embeddedOutcomeId)}
                />
              </div>
            ) : null}
            {tableState === "view" ? (
              <div
                onClick={(e) => modifyView(e, cardData.driverId)}
                data-cardid={cardData.driverId}
                className={styles.view_div}
              >
                V
              </div>
            ) : null}
            {createAnArrow && !PDFState && !recordLockState ? (
              <FontAwesomeIcon
                className={`${styles.card_arrow} ${
                  isSelectedForArrow ? styles.selected_cluster : ""
                }`}
                icon={faArrowUp}
                data-cardid={selOutcome.id}
                data-type="outcome"
                onClick={(e) => MakeAnArrow(e, cardData, "outcome")}
              />
            ) : null}
            {cluster && !PDFState ? (
              <div
                className={`${styles.card_arrow} ${
                  isSelectedForCluster ? styles.selected_cluster : ""
                }`}
                onClick={(e) => MakeCluster(e, cardData)}
                data-carddata={cardData.clusterId}
              >
                C{" "}
              </div>
            ) : null}
          </Row>
        </Card.Body>
      </Card>
    );
  };

  const delCluster = async (e) => {
    e.preventDefault();
    if (recordLockState) {
      //kick them out and dont let them delete
      return;
    }
    if (!e.target.dataset.cluster) {
      e.stopPropagation();
      return;
    }
    //check to see if there is an arrow attached to the cluster to cascade the delete
    let sures = window.confirm(
      "Are you sure you want to delete this cluster?  This will also delete any arrows attached to this cluster."
    );
    if (!sures) {
      return;
    }
    let clusterId =
      "tier" +
      e.target.dataset.tierlevel +
      "cluster" +
      e.target.dataset.cluster;
    let arrowid;
    for (let i = 0; i < arrows.length; i++) {
      if (arrows[i].start === clusterId || arrows[i].end === clusterId) {
        arrowid = arrows[i].id;
        deleteArrow(arrowid);
      }
    }

    deleteCluster(e.target.dataset.cluster);
    await getOutcome(selOutcome.id).then((data) => {
      setSelOutcome(data.data);
    });
    window.location.reload();
  };

  async function drop(e) {
    e.preventDefault();
    //on drop, sets the drivers new Tier and subTier as required.  The driver is then updated in the database so it will be placed in its new place on the next render.  it also looks to see if there are cards already in that tier and subtier and shifts the existing cards down.
    if (recordLockState) {
      //kick them out and dont let them drag
      return;
    }
    setLoading(true);
    let shift = 1; //minimum shift value
    let count = 0; //used to count size of the cluster
    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    let aBody = {}; //for arrow updates
    let clusterArray = [];
    let shiftReq = false; //starting assumption is it is a movement into a blank spot
    let cardname = data.cardname;
    let dragStart = Number(data.tierlevel);
    let dragEnd = Number(e.currentTarget.dataset.tierlevel); //the ending tier
    let targetSubTier = Number(e.currentTarget.dataset.subtier);
    let clusterId = Number(data.cluster); //will be null if not draggin a cluster
    let clusterName = clusterId
      ? "tier" + dragStart + "cluster" + clusterId
      : null;
    let clusterTarget = Number(e.currentTarget.dataset.cluster);
    let driverId = Number(data.cardid);
    let tempDriverTree = []; //in case there is a null in the obhect
    if (driverTreeObj[dragEnd]) {
      tempDriverTree =
        driverTreeObj[dragEnd].length > 0
          ? driverTreeObj[dragEnd].sort((a, b) =>
              a.subTier > b.subTier ? 1 : -1
            )
          : [];
    }
    if (clusterId > 0) {
      clusterArray = driverTreeObj[dragStart].filter(
        (item) => item.clusterId === clusterId
      );
    }

    if (!dragEnd) {
      //they didnt drag it to a valid spot, so just return
      setLoading(false);
      return;
    }
    //check if there is a card in the slot, shift the cards down, else, just update the card, if the card dragged is in a cluster, then update all the cards in the cluster and shift the cards down the needed amount
    debugger;
    for (const drivers of tempDriverTree) {
      debugger;
      if (drivers.subTier === targetSubTier) {
        shiftReq = true;
        if (clusterTarget > 0) {
          //this means that the drop spot is in a cluster, so we need to find the top spot in the cluster, make that the subTier for the dropped card and shift all cards below that spot down by one
          count = tempDriverTree.filter(
            (item) => item.clusterId === clusterTarget
          );
          targetSubTier = count[0].subTier;
        }
        //kick out of loop
        break;
      } else if (
        drivers.subTier > targetSubTier &&
        drivers.subTier <= targetSubTier + clusterArray.length &&
        clusterArray.length > 0 &&
        drivers.clusterId !== clusterId
      ) {
        shiftReq = true;
        break;
      }
    }

    //make the move, do this after the cluster check so that you get the right subtier
    let body = {
      tierLevel: dragEnd,
      subTier: targetSubTier,
    }; //set the data to update the moved card
    if (clusterArray.length === 0) {
      await updateOutcomeDriver(selOutcome.id, driverId, state.userId, body);
    } else {
      for (let i = 0; i < clusterArray.length; i++) {
        let body = {
          tierLevel: dragEnd,
          subTier: targetSubTier + i,
        }; //set the data to update the moved card
        await updateOutcomeDriver(
          selOutcome.id,
          clusterArray[i].driverId,
          state.userId,
          body
        );
      }
    }
    if (shiftReq && isNaN(clusterId)) {
      //remove the card from the temp array, this frees up that spot for the moved card
      tempDriverTree = tempDriverTree.filter(
        (item) => item.driverId !== Number(driverId)
      );
      //now shift the other cards down
      for (let i = 0; i < tempDriverTree.length; i++) {
        //since there is already a card there, shift all of the cards with a subTier equal to or higher down one spot until you hit an empty spot, then stop;
        if (tempDriverTree[i].subTier >= targetSubTier) {
          //not dropping onto a cluster, so just move them down by 1
          body = {
            tierLevel: tempDriverTree[i].tierLevel,
            subTier: tempDriverTree[i].subTier + shift,
          };
          await updateOutcomeDriver(
            selOutcome.id,
            tempDriverTree[i].driverId,
            state.userId,
            body
          );
          //checking for blank spot
          if (i < tempDriverTree.length - 1) {
            if (tempDriverTree[i + 1].subTier - tempDriverTree[i].subTier > 1) {
              i = tempDriverTree.length; //make this last month then exit loop
            }
          }
        }
      }
    } else if (shiftReq && clusterId > 0) {
      //you are moving a cluster.
      //now shift the cards below that spot by the length of the cluster
      let maxShift = clusterArray.length;
      shift = maxShift;
      tempDriverTree = tempDriverTree.filter(
        (item) => item.clusterId !== Number(clusterId)
      );
      for (let i = 0; i < tempDriverTree.length; i++) {
        //since there is already a card there, shift all of the cards with a subTier equal to or higher down one spot until you hit an empty spot, then stop;
        if (
          tempDriverTree[i].clusterId !== clusterId &&
          tempDriverTree[i].subTier === targetSubTier
        ) {
          //if the card is exactly equal, it shifts by max
          body = {
            tierLevel: tempDriverTree[i].tierLevel,
            subTier: tempDriverTree[i].subTier + maxShift,
          };
          await updateOutcomeDriver(
            selOutcome.id,
            tempDriverTree[i].driverId,
            state.userId,
            body
          );
          //now see if the next card needs to shift by the same amount or less if there is a gap
          if (i < tempDriverTree.length - 1) {
            if (tempDriverTree[i + 1].subTier - tempDriverTree[i].subTier > 1) {
              shift -=
                tempDriverTree[i + 1].subTier - tempDriverTree[i].subTier;
            }
            if (shift < 0) {
              shift = 0;
            }
          }
        } else if (
          tempDriverTree[i].clusterId !== clusterId &&
          tempDriverTree[i].subTier > targetSubTier &&
          shift > 0
        ) {
          //now see if the next card needs to shift and shift it then adjust shift
          if (tempDriverTree[i].subTier <= targetSubTier + maxShift) {
            body = {
              tierLevel: tempDriverTree[i].tierLevel,
              subTier: tempDriverTree[i].subTier + shift,
            };
            //now see if you are moving the card down into an empty spot, if you are, shift goes down by one.
            //now see if the next card needs to shift by the same amount or less if there is a gap
            if (i < tempDriverTree.length - 1) {
              if (
                tempDriverTree[i + 1].subTier - tempDriverTree[i].subTier >
                1
              ) {
                shift -=
                  tempDriverTree[i + 1].subTier - tempDriverTree[i].subTier;
              }
              if (shift < 0) {
                shift = 0;
              }
            }
            await updateOutcomeDriver(
              selOutcome.id,
              tempDriverTree[i].driverId,
              state.userId,
              body
            );
          }
          if (i < tempDriverTree.length - 1) {
            if (tempDriverTree[i + 1].subTier - tempDriverTree[i].subTier > 1) {
              shift -=
                tempDriverTree[i + 1].subTier - tempDriverTree[i].subTier;
            }
            if (shift < 0) {
              shift = 0;
            }
          }
        }
        //the number of spots to shift depends on whether you are dropping it right on top or offset, calculate the shift value then apply it to the cards below
        //not dropping onto a cluster, so just move them down by shift
      }
    }
    //look through the arrows state to find any arrows with the affected cardid as a start or endpoint then update.  first we create an array that contains the names of the cards in the cluster plus the cluterName before it was moved, then we look through the arrows object for arrows that have a .start or .end with anything in the array and update the arrows accordingly
    if (dragStart !== dragEnd) {

      //The user moved the card up / down a tier, so the arrows need to be updated to reflect the new tier

      //cycle through arrow array and update the arrows as needed.  look in the drivertreeobj for the tiers of the other cards as the DOM will be mid refresh so its a challenge grab by element id
      //if you drug a cluster, you need to check for arrows that start or end in the cluster plus all the arrows attached to cards in the cluster.  to do this, you need to find all the cards in the cluster and then find all the arrows that have the cluster as a start or end point
      let itemsToCheck = [];
      if (clusterId > 0) {
        for (let item of clusterArray) {
          itemsToCheck.push("card" + item.driverId);
        }
        itemsToCheck.push(clusterName);
      } else {
        itemsToCheck.push(cardname);
      }
      //now go through the arrows and update them as needed based on the itemsToCheck array filter out all arrows that dont contain the info we are looking for


      const matchedArrows = arrows
        .filter(
          (arrow) =>
            itemsToCheck.includes(arrow.start) ||
            itemsToCheck.includes(arrow.end)
        )
        .map((arrow) => ({
          ...arrow,
          matchedBy: itemsToCheck.includes(arrow.start) ? "start" : "end",
        }));

      //now we go through those arrows and update them accordingly.  first we find out the original arrow start and end tiers then compare them to the new start and end tiers to determine how to update the arrow.  if the start and end are on the same tier, the arrow will be dashed and the attach points will be on the left side of the card.  if the start is higher than the end, the arrow will be solid and the attach points will be on the left side of the start card and the right side of the end card.  if the start is lower than the end, the arrow will be solid and the attach points will be on the right side of the start card and the left side of the end card.
      //now we check if we need to make the arrow dashed because drag
      let fArray = driverTreeObj.flat();
      let endTier = "";
      let startTier = "";

      for (let i = 0; i < matchedArrows.length; i++) {
        //use driverTreeObj in case DOM refreshes mid check
        //check if it was matched by start or end then set the start and end variables accordingly

        //if the match is the start, then the endTier is the dragEnd, if the match is the end, then the startTier is the dragEnd
        if (matchedArrows[i].matchedBy === "start") {
          startTier = dragEnd;
          if (matchedArrows[i].end.slice(0, 4) === "card") {
            endTier = fArray.find(
              (card) => card?.driverId === Number(matchedArrows[i].end.slice(4))
            )?.outcomeDrivers?.tierLevel;
          } else {
            endTier = fArray.find(
              (card) =>
                card?.clusterId === Number(matchedArrows[i].end.slice(12))
            )?.outcomeDrivers?.tierLevel;
          }
        } else {
          endTier = dragEnd;
          if (matchedArrows[i].end.slice(0, 4) === "card") {
            startTier = fArray.find(
              (card) =>
                card?.driverId === Number(matchedArrows[i].start.slice(4))
            )?.outcomeDrivers?.tierLevel;
          } else {
            startTier = fArray.find(
              (card) =>
                card?.clusterId === Number(matchedArrows[i].start.slice(12))
            )?.outcomeDrivers?.tierLevel;
          }
        }

        //set startC or endC to the cluster name if the arrow is in a cluster
        let endC =
          matchedArrows[i].end.slice(0, 4) === "card"
            ? ""
            : "tier" +
              endTier +
              "cluster" +
              Number(matchedArrows[i].end.slice(12));

        let startC =
          matchedArrows[i].start.slice(0, 4) === "card"
            ? ""
            : "tier" +
              startTier +
              "cluster" +
              Number(matchedArrows[i].start.slice(12));
        if (matchedArrows[i].matchedBy === "start") {
          //the start of the arrow was moved so compare the dropped tier with the start tier then adjust the arrow accordingly
          if (startTier === endTier) {
            let endC =
              matchedArrows[i].start.slice(0, 4) === "card"
                ? ""
                : "tier" +
                  endTier +
                  "cluster" +
                  Number(matchedArrows[i].end.slice(12));

            let startC =
              matchedArrows[i].end.slice(0, 4) === "card"
                ? ""
                : "tier" +
                  startTier +
                  "cluster" +
                  Number(matchedArrows[i].start.slice(12));
            //make the arrow dashed and use the left attach points
            aBody.start = startC ? startC : matchedArrows[i].start;
            aBody.end = endC ? endC : matchedArrows[i].end;
            aBody.dashness = true;
            aBody.startAnchor = { position: "left", offset: { y: 0 } };
            aBody.endAnchor = { position: "left", offset: { y: 0 } };
            aBody.gridBreak = "50";
          } else if (startTier > endTier) {
            //make the arrow normal and use the left attach points
            //set startC or endC to the cluster name if the arrow is in a cluster
            //set startC or endC to the cluster name if the arrow is in a cluster, invert them for this use case
            let endC =
              matchedArrows[i].start.slice(0, 4) === "card"
                ? ""
                : "tier" +
                  endTier +
                  "cluster" +
                  Number(matchedArrows[i].end.slice(12));

            let startC =
              matchedArrows[i].end.slice(0, 4) === "card"
                ? ""
                : "tier" +
                  startTier +
                  "cluster" +
                  Number(matchedArrows[i].start.slice(12));
            aBody.start = startC ? startC : matchedArrows[i].start;
            aBody.end = endC ? endC : matchedArrows[i].end;
            aBody.dashness = false;
            aBody.startAnchor = { position: "left", offset: { y: 0 } };
            aBody.endAnchor = { position: "right", offset: { y: 0 } };
            aBody.gridBreak = "50";
          } else {
            //make the arrow normal and use the right attach points but swap the start and end cards
            let endC =
              matchedArrows[i].start.slice(0, 4) === "card"
                ? ""
                : "tier" +
                  endTier +
                  "cluster" +
                  Number(matchedArrows[i].end.slice(12));

            let startC =
              matchedArrows[i].end.slice(0, 4) === "card"
                ? ""
                : "tier" +
                  startTier +
                  "cluster" +
                  Number(matchedArrows[i].start.slice(12));
            aBody.start = endC ? endC : matchedArrows[i].end;
            aBody.end = startC ? startC : matchedArrows[i].start;
            aBody.dashness = false;
            aBody.startAnchor = { position: "left", offset: { y: 0 } };
            aBody.endAnchor = { position: "right", offset: { y: 0 } };
            aBody.gridBreak = "50";
          }
        } else {
          //the end card was moved so compare the dropped tier with the end tier then adjust the arrow accordingly
          if (endTier === startTier) {
            //make the arrow dashed and use the left attach points
            let endC =
              matchedArrows[i].start.slice(0, 4) === "card"
                ? ""
                : "tier" +
                  endTier +
                  "cluster" +
                  Number(matchedArrows[i].end.slice(12));

            let startC =
              matchedArrows[i].end.slice(0, 4) === "card"
                ? ""
                : "tier" +
                  startTier +
                  "cluster" +
                  Number(matchedArrows[i].start.slice(12));
            aBody.start = startC ? startC : matchedArrows[i].start;
            aBody.end = endC ? endC : matchedArrows[i].end;
            aBody.dashness = true;
            aBody.startAnchor = { position: "left", offset: { y: 0 } };
            aBody.endAnchor = { position: "left", offset: { y: 0 } };
            aBody.gridBreak = "50";
          } else if (startTier > endTier) {
            //make the arrow normal and use the left attach points
            aBody.start = startC ? startC : matchedArrows[i].start;
            aBody.end = endC ? endC : matchedArrows[i].end;
            aBody.dashness = false;
            aBody.startAnchor = { position: "left", offset: { y: 0 } };
            aBody.endAnchor = { position: "right", offset: { y: 0 } };
            aBody.gridBreak = "50";
          } else {
            //make the arrow normal and use the right attach points but swap the start and end cards
            //set startC or endC to the cluster name if the arrow is in a cluster
            let endC =
              matchedArrows[i].start.slice(0, 4) === "card"
                ? ""
                : "tier" +
                  endTier +
                  "cluster" +
                  Number(matchedArrows[i].end.slice(12));

            let startC =
              matchedArrows[i].end.slice(0, 4) === "card"
                ? ""
                : "tier" +
                  startTier +
                  "cluster" +
                  Number(matchedArrows[i].start.slice(12));
            aBody.start = endC ? endC : matchedArrows[i].end;
            aBody.end = startC ? startC : matchedArrows[i].start;
            aBody.dashness = false;
            aBody.startAnchor = { position: "left", offset: { y: 0 } };
            aBody.endAnchor = { position: "right", offset: { y: 0 } };
            aBody.gridBreak = "50";
          }
        }
        if (aBody.gridBreak) {
          updateArrow(matchedArrows[i].id, aBody);
          aBody = {};
        }
      }
    }
    body = { modified: "Yes" };
    //tag the driver as updated since you moved it
    await updateDriver(driverId, state.userId, body);
    getArrows(selOutcome.id).then((data) => {
      setArrows(data.data);
    });
    await getDriverByOutcome(selOutcome.id).then((data) => {
      setDriverTreeObj(data.data);
    });
  }

  const delDriver = async (e) => {
    e.preventDefault();
    if (
      !window.confirm(
        "Are you sure you want to delete this driver?  This will also delete any arrows attached to this driver."
      )
    ) {
      return;
    }

    let arrowid = 0;
    let delCardId = "card" + e.target.dataset.cardid;
    for (let i = 0; i < arrows.length; i++) {
      if (arrows[i].start === delCardId || arrows[i].end === delCardId) {
        arrowid = arrows[i].id;
        deleteArrow(arrowid);
      }
    }

    deleteDriver(e.target.dataset.cardid);
    let body = { outcomeId: selOutcome.id, driverId: e.target.dataset.cardid };
    removeOutcomeDriver(body);

    let updatedoutcome = await getOutcome(selOutcome.id);
    setSelOutcome(updatedoutcome.data);
  };

  const goToDriverTree = (embeddedOutcomeId) => {
    //goes to the embedded drivertree; the outcome idea is the outcomeId of the target
    setSelOutcome({ id: embeddedOutcomeId });
  };

  const goToOutcome = async (e) => {
    navigate("/allOutcomes/" + selOutcome.id);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (recordLockState) {
      //kick them out and dont let them drag
      return;
    }
    let body = { [e.target.name]: e.target.value, modified: "Yes" };
    if (e.target.name === "status") {
      //if the user changes the status, then ask if they want to update all the future cards in the driver chain's statust, if yes, then execute cascadeUpdate
      let sures = window.confirm(
        "Do you want to update all future cards in this driver chain to this status?  This will also change the status of any cards in a future cluster if this card is a driver of the entire cluster."
      );
      if (sures) {
        await cascadeUpdate(
          arrows,
          e.target.dataset.cardid,
          e.target.dataset.tierlevel,
          e.target.value
        );
      } else {
        await updateDriver(e.target.dataset.cardid, state.userId, body);
      }
    } else {
      await updateDriver(e.target.dataset.cardid, state.userId, body);
    }
    await getOutcome(selOutcome.id).then((data) => {
      setSelOutcome(data.data);
    });
    await getDriverByOutcome(selOutcome.id).then((data) => {
      setDriverTreeObj(data.data);
    });
  };
  //close the modal
  const handleClose = () => {
    setArrowModal(false);
    setArrowMod(false);
    setCreateDriverModal(false);
  };

  const handleSelOutcomeChange = async (e) => {
    e.preventDefault();
    let body = { [e.target.name]: e.target.value };
    await updateOutcome(e.target.dataset.cardid, state.userId, body);
    getOutcome(selOutcome.id).then((data) => {
      setSelOutcome(data.data);
    });
  };

  const handleClusterChange = (e) => {
    let body = { [e.target.name]: e.target.value };
    updateCluster(e.target.dataset.cluster, body);
  };

  //uses the length of the selected elements array to determine if the user is connecting to a driver or a cluster for the first or second element when making an arrow
  const handleSelect = async (e) => {
    if (e.target.id === "driver" && selectedElements.length === 1) {
      selectedElements[0].clusterId = null;
    } else if (e.target.id === "driver" && selectedElements.length === 2) {
      selectedElements[1].clusterId = null;
    }
    if (selectedElements.length === 2) {
      CreateAnArrow({
        setCreateAnArrow,
        selectedElements,
        selOutcome,
        setSelOutcome,
      });
      setSelectedElements([]);
    }
    setShow(false);
  };

  const goToDriver = async (e) => {
    e.preventDefault();
    navigate("/drpage/" + selOutcome.id + "/" + e.target.dataset.cardid);
  };

  //uses the CreateArrow function to make an arrow between two cards
  const MakeAnArrow = async (e, cardData, type) => {
    e.preventDefault();
    //check to see if you've already selected the card, if so, remove it otherwise add it
    if (
      selectedElements.some((item) => item.driverId === cardData.driverId) ===
      true
    ) {
      let newArrowArray = selectedElements.filter(
        (item) => item.driverId !== cardData.driverId
      );
      setSelectedElements(newArrowArray);
    } else {
      setSelectedElements([...selectedElements, cardData]);
    }
  };

  //makes a cluster from the selected cards
  const MakeCluster = async (e, cardData) => {
    //in order once the C is clicked in the bottom right hand corner of every card:
    //1. check to see if the card is already in a cluster
    //1a. if it is, open a modal that asks if the user wants to do one of the following:  a.)  remove it from the cluster,  b.)  add it to a new cluster,  c.)  cancel the selection of that card
    //2.  if the card is not in a cluster, then add it to the clusterSelection array
    //3.  when the user hits the "Execute" button at the top of the screen, and the clusterArray isnt empty, then create the cluster and update the cards in the database
    //this function executes step 1 and 2 above, the execute button does step 3.
    e.preventDefault();

    if (recordLockState) {
      //kick them out and dont let them drag
      return;
    }

    //check to see if the card is already in the clusterArray, if it is, remove it, if not add it
    if (
      clusterArray.some((item) => item.driverId === cardData.driverId) === true
    ) {
      //remove the card from the clusterArray
      let newClusterArray = clusterArray.filter(
        (item) => item.driverId !== cardData.driverId
      );
      setClusterArray(newClusterArray);
    } else {
      //add driver info to the array
      setClusterArray([...clusterArray, cardData]);
    }

    //set the clusterTier if it is not already set
    if (!clusterTier) {
      setClusterTier(cardData.tierLevel);
    } else if (clusterTier !== cardData.tierLevel) {
      //if the cards are in different tiers, then let the user pick a tier for the cluster
      //todo:  make the tierModal let them select the tier and then autoplace the cluster in the correct spot
      // setTierModal(true);
      alert(
        "You cannot create a cluster with cards from different tiers.  Please drag them into the same tier and try again."
      );
      window.location.reload();
    }
    //check if the card is already in a cluster, if it is, open clusterCheckModal, if not, add it to the clusterSelection array
    if (cardData.clusterId) {
      setShowClusterModal(true);
    }
  };

  //used to add or remove a card from a view.  also updates / sets the opacity of any arrows that are attached to the card
  const modifyView = async (e) => {
    //check to see if the card is already in the view
    //if it is, remove it from the view, otherwise add it to the view
    //check to see if there are already views, if not, return an error.
    if (!viewId) {
      alert("You must create or select a view before you can add cards to it.");
      return;
    }

    if (
      // eslint-disable-next-line eqeqeq
      viewObj.findIndex((item) => item.driverId == e.target.dataset.cardid) !==
      -1
    ) {
      //the card is already in the view, so  remove it and check the viewArrows object to see if any arrow that starts from it needs to be removed.  All error handling logic is server side
      let arrowCheck = arrows.filter(
        (item) => item.start === `card${e.target.dataset.cardid}`
      );

      if (arrowCheck.length > 0) {
        //there are arrows attached to the card, so delete them
        for (let i = 0; i < arrowCheck.length; i++) {
          let body = { viewId: viewId, arrowId: arrowCheck[i].id };

          await removeViewArrow(body);
        }
      }
      let driverId = parseInt(e.target.dataset.cardid);
      let body = { viewId: viewId, driverId: driverId };
      await removeViewCard(body);
    } else {
      //the card is not in the view, so add it and any arrows that start from it, first check the viewArrows object (for database integrity) then here we look at the arrows object  because we want to add the arrows to the viewArrows object.  Check to see if the card is in a cluster, if it is, add all arrows from the cluster too.  All error handling logic is server side.
      let arrowCheck = arrows.filter(
        (item) => item.start === `card${e.target.dataset.cardid}`
      );
      if (arrowCheck.length > 0) {
        let arrowArray = arrows.filter(
          (item) => item.start === `card${e.target.dataset.cardid}`
        );
        if (arrowArray.length > 0) {
          //there is an arrow attached to the card, so add them to the view
          let aBody = {};
          for (let i = 0; i < arrowArray.length; i++) {
            aBody = { viewId: viewId, arrowId: arrowArray[i].id };
            addViewArrow(aBody);
          }
        }
      }
      let body = { viewId: viewId, driverId: e.target.dataset.cardid };
      addViewCard(body);
    }
    // get the updated viewObj
    await getViewCards(viewId).then((data) => {
      setViewObj(data.data);
    });
    await getViewArrows(viewId).then((data) => {
      setViewArrows(data.data);
    });
    let val;
    if (opacity < 25) {
      val = opacity + 0.01;
    } else if (opacity >= 25) {
      val = opacity - 0.01;
    }
    setOpacity(val);
  };

  //used to handle the submit of the modals for clusters and arrows
  const onModalSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };

  //used with the cluster-mod-modal to remove a card from the cluster it is in and reload the page
  const removeCluster = async () => {
    //remove the clusterId from the driver, update the driver in the database, move it below the cluster, then reload the page
    let body = { clusterId: null };
    await updateDriver(
      clusterArray[clusterArray.length - 1].driverId,
      state.userId,
      body
    );

    let count = 0; //use negative 1 since the driverTreeObj still has the original card in it

    for (let subArray of driverTreeObj) {
      if (!Array.isArray(subArray)) continue; // Skip the null or non-array elements like the Tier 0
      for (let driver of subArray) {
        if (
          driver.clusterId ===
            clusterArray[clusterArray.length - 1].clusterId &&
          driver.subTier > clusterArray[clusterArray.length - 1].subTier
        ) {
          count++;
          await updateOutcomeDriver(
            selOutcome.id,
            driver.outcomeDrivers.driverId,
            state.userId,
            { subTier: driver.subTier - 1 }
          );
        }
      }
    }

    //now shift the subtier down by the number of cards in the cluster by using the count feature
    await updateOutcomeDriver(
      selOutcome.id,
      clusterArray[clusterArray.length - 1].driverId,
      state.userId,
      { subTier: clusterArray[clusterArray.length - 1].subTier + count }
    );
    window.location.reload();
  };

  function tierButtons(tierLevel) {
    if (state.userRole !== "Stakeholder" && !recordLockState) {
      return (
        <Button
          className={styles.tier_btn}
          data-tierlevel={`${tierLevel}`}
          onClick={(e) => createNewDriver(e)}
        >
          +
        </Button>
      );
    }
  }

  function tierCards(tierLevel, driverTreeObj, { viewObj }) {
    let viewCheck;
    const arr = []; //just an empty arr that will be filled with driverTreeObj
    let clusterNumber = 0; //this is just used to see how far to expand a cluster
    let clusterName; //doing it this way to so i dont need the logic when dealing with the first element of the array.
    if (!driverTreeObj) {
      const blankDiv = [];
      for (let i = 0; i < 20; i++) {
        //create 20 empty divs for the user to drop a driverCard
        blankDiv.push(
          <div
            className={styles.my_div}
            data-tierlevel={tierLevel} //this is used by the update arrows logic to compare the ending and starting div of a drag and if an arrow needs to be updated.
            data-subtier={i + 1}
            id={`tier${tierLevel}subTier` + (i + 1)}
            onDragOver={allowDrop}
            onDrop={drop}
            key={`${tierLevel}div${i + 1}`}
          ></div>
        );
      }
      return blankDiv;
    } else {
      //find max number of droppable divs needed for any given tier, then size the columns accordingly.  This will let the columns grow with each tier
      let max = 20;
      for (let i = 0; i < 5; i++) {
        //now get the number of elements in the driverTreeObj and set the max equal to it plus 1
        if (driverTreeObj[i]) {
          if (driverTreeObj[i].subTier >= max) {
            max = driverTreeObj[i].subTier + 1;
          }
        }
      }
      for (let i = 0; i < max; i++) {
        //needs a nested loop for those instances when the driverTreeObj is smaller than 30

        // logic as follows:  insert a placeholder row, then check to see if there should be a card or a cluster, if yes, pop that row and insert card
        arr.push("skip");
        for (let j = 0; j < driverTreeObj.length; j++) {
          let t = i + 1; //the subtiers for the users start at 1 not 0
          if (
            driverTreeObj[j].tierLevel === tierLevel &&
            driverTreeObj[j].subTier === t
          ) {
            arr[i] = driverTreeObj[j];
          }
        }
      }

      // eslint-disable-next-line array-callback-return
      return arr.map((f, index) => {
        //first check if it is an empty div, then check if it is a cluster, then check if it is a driver.  If it is a driver, then check to see if it is part of a cluster.
        let clusterViewCheck = -1; //this initializes the ClusterViewCheck for every row of the column, the cluster opacity will be reset after the If check
        if (arr[index] === "skip") {
          //empty div, create a spot to drop a driverCard
          return (
            <div
              className={styles.my_div}
              data-tierlevel={tierLevel} //this is used by the update arrows logic to compare the ending and starting div of a drag and if an arrow needs to be updated.
              data-subtier={index + 1}
              id={`tier${tierLevel}subTier` + (index + 1)}
              onDragOver={allowDrop}
              onDrop={drop}
              key={`${tierLevel}div${index + 1}`}
            ></div>
          );
        } else if (
          //check to see if the driver is part of a cluster and ensure that it is still in the current cluster or if a new cluster needs to be started.
          arr[index].clusterId !== null &&
          arr[index].clusterId !== clusterNumber
        ) {
          //check to see how large the cluster is, then create a div for each card in the cluster
          //create a new array for each driver in the cluster then map the array to create the cards
          clusterNumber = arr[index].clusterId; //update to the current clusterNumber so we can fill the cluster with the correct cards.
          clusterName = arr[index].cluster.clusterName; //update to the current name
          let objCheck = driverTreeObj.filter(
            (item) => item.clusterId === clusterNumber
          );
          //this is for the views
          for (let i = 0; i < objCheck.length; i++) {
            if (viewObj && viewObj.length > 0) {
              let idCheck = objCheck[i].outcomeDrivers.driverId;
              for (let j = 0; j < viewObj.length; j++) {
                if (viewObj[j].driverId === idCheck) {
                  clusterViewCheck = 1;
                }
              }
            }
          }

          let clusterArr = [];
          for (let j = index; j < arr.length; j++) {
            if (arr[j].clusterId === clusterNumber) {
              clusterArr.push(arr[j]);
              // index++;
            } else {
              j = arr.length;
              // index++;
            }
          }

          return (
            <div
              className={styles.my_cluster}
              data-tierlevel={tierLevel}
              style={
                // eslint-disable-next-line eqeqeq
                clusterViewCheck != -1 ? { opacity: 1 } : { opacity: opacity }
              }
              data-subtier={index + 1}
              key={`${tierLevel}cluster${clusterNumber}`}
              data-cluster={clusterNumber} //this is the clusterId for cluster updates
              id={`tier${tierLevel}cluster` + clusterNumber} //this is used for the arrow start and end points
              onClick={delCluster}
              onDragOver={allowDrop} //lets you drop cards where a cluster is and shift the cluster down out of the way
              onDrop={drop} //in the drop function youll find the code to detect if it was dropped on a cluster and shift the cards down
            >
              {/* text input for clusterName */}
              {!recordLockState ? (
                <Form style={{ width: "95%" }}>
                  <Form.Control
                    size="sm"
                    type="text"
                    data-cluster={clusterNumber}
                    className={styles.my_cluster_name}
                    defaultValue={clusterName}
                    placeholder="Cluster Name"
                    //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                    name="clusterName"
                    onBlur={handleClusterChange}
                  />
                </Form>
              ) : (
                <div className={styles.my_cluster_name}>{clusterName}</div>
              )}

              {clusterArr.map((f, ind) => {
                if (viewObj && viewObj.length > 0) {
                  viewCheck = viewObj.findIndex(
                    (item) =>
                      item.driverId == clusterArr[ind].outcomeDrivers.driverId
                  );
                } else {
                  viewCheck = -1;
                }

                return DCards(clusterArr[ind], tierLevel, viewCheck);
              })}
            </div>
          );
        } else if (arr[index].clusterId !== clusterNumber) {
          if (viewObj && viewObj.length > 0) {
            viewCheck = viewObj.findIndex(
              (item) => item.driverId == arr[index].outcomeDrivers.driverId
            );
          } else {
            viewCheck = -1;
          }

          //the driver is not part of a cluster, so just create the card
          return (
            <div
              className={styles.my_div}
              data-tierlevel={tierLevel}
              data-subtier={index + 1}
              id={"tier1subTier" + (index + 1)}
              onDragOver={allowDrop}
              onDrop={drop}
              key={`${tierLevel}div${index + 1}`}
            >
              {DCards(arr[index], tierLevel, viewCheck)}
            </div>
          );
        }
      });
    }
  }

  const useDrag = (e) => {
    if (recordLockState) {
      //kick them out and dont let them drag
      return;
    }
    const data = {
      cardid: e.target.dataset.cardid,
      cardname: e.target.id,
      tierlevel: e.target.dataset.tierlevel,
      cluster: e.target.dataset.cluster,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(data));
  };

  return (
    <>
      <Row id="topdiv" className={styles.top_div}>
        <Xwrapper>
          {/* <Row style={{width: "1400px"}}> */}
          <Col
            className={styles.driver}
            key="0"
            style={{ justifyItems: "center", alignContent: "center" }}
          >
            <Row>Tier 0</Row>
            <Row
              id="outcomeColumn"
              key="outcomeColumn1"
              className={styles.my_row}
            >
              <Card
                className={styles.outcome_card}
                id={`outcomeId${selOutcome.id}`}
                key={`outcomeCard${selOutcome.id}`}
              >
                <Form>
                  <Form.Control
                    as="select"
                    id="status"
                    data-cardid={selOutcome.id}
                    value={selOutcome.status}
                    className={
                      selOutcome.status === "Green"
                        ? styles.green_status
                        : selOutcome.status === "Yellow"
                        ? styles.yellow_status
                        : selOutcome.status === "blue"
                        ? styles.blue_status
                        : styles.red_status
                    }
                    //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                    name="status"
                    onChange={handleSelOutcomeChange}
                  >
                    <option
                      key={1}
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: "green",
                      }}
                    >
                      Green
                    </option>
                    <option
                      key={2}
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: "yellow",
                      }}
                    >
                      Yellow
                    </option>
                    <option
                      key={3}
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: "red",
                      }}
                    ></option>
                    <option
                      key={4}
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: "blue",
                      }}
                    ></option>
                  </Form.Control>
                </Form>

                <Card.Body className={styles.my_card_body}>
                  <Row className={styles.card_row}>
                    <Col className={styles.card_col_abbrev}>
                      <FontAwesomeIcon
                        className={styles.card_flag}
                        icon={faFlagUsa}
                        id="usflag"
                        data-cardid={selOutcome.id}
                        onClick={goToOutcome}
                      />
                    </Col>
                    <Col className={styles.card_col_body}>
                      {!PDFState ? (
                        <Form>
                          <Form.Control
                            as="textarea"
                            data-cardid={selOutcome.id}
                            className={styles.my_card_text}
                            defaultValue={selOutcome.outcomeTitle}
                            //Key Note:  all input fields must have a name that matches the database column name so that the handleInputChange function can update the state properly
                            name="outcomeTitle"
                            onBlur={handleSelOutcomeChange}
                          />
                        </Form>
                      ) : (
                        <div className={styles.my_card_text_pdf}>
                          {selOutcome.outcomeTitle}
                        </div>
                      )}
                    </Col>
                  </Row>
                  {createAnArrow && !PDFState && !recordLockState ? (
                    <FontAwesomeIcon
                      className={styles.card_arrow}
                      icon={faArrowUp}
                      data-cardid={selOutcome.id}
                      data-type="outcome"
                      onClick={(e) => MakeAnArrow(e, selOutcome, "outcome")}
                    />
                  ) : null}
                </Card.Body>
              </Card>
              <Row style={{ minHeight: "500px", width: "100%" }}>
                <br />
                <br />
                {!loading && legendState ? (
                  <Legend
                    driverTreeObj={driverTreeObj}
                    selOutcome={selOutcome}
                    recordLockState={recordLockState}
                    state={state}
                    PDFState={PDFState}
                  />
                ) : null}
              </Row>
            </Row>
          </Col>
          {!loading ? (
            <>
              <Col className={styles.driver} key="1">
                <Row>Tier 1 Drivers {tierButtons(1)}</Row>
                <Row
                  id={`tier1Cards`}
                  key={`tier1Cards`}
                  className={styles.my_row}
                >
                  {tierCards(1, driverTreeObj[1], { viewObj })}
                </Row>
              </Col>
              <Col className={styles.driver} key="2">
                <Row>Tier 2 Drivers {tierButtons(2)}</Row>
                <Row
                  id={`tier2Cards`}
                  key={`tier2Cards`}
                  className={styles.my_row}
                >
                  {tierCards(2, driverTreeObj[2], { viewObj })}
                </Row>
              </Col>
              <Col className={styles.driver} key="3">
                <Row>Tier 3 Drivers{tierButtons(3)}</Row>
                <Row
                  id={`tier3Cards`}
                  key={`tier3Cards`}
                  className={styles.my_row}
                >
                  {tierCards(3, driverTreeObj[3], { viewObj })}
                </Row>
              </Col>
              <Col className={styles.driver} key="4">
                <Row>Tier 4 Drivers {tierButtons(4)}</Row>
                <Row
                  id={`tier4Cards`}
                  key={`tier4Cards`}
                  className={styles.my_row}
                >
                  {tierCards(4, driverTreeObj[4], { viewObj })}
                </Row>
              </Col>
              <Col className={styles.driver} key="5">
                <Row>Tier 5 Drivers {tierButtons(5)}</Row>
                <Row
                  id={`tier5Cards`}
                  key={`tier5Cards`}
                  className={styles.my_row}
                >
                  {tierCards(5, driverTreeObj[5], { viewObj })}
                </Row>
              </Col>
            </>
          ) : null}
          {!loading ? (
            <DriverArrows
              arrows={arrows}
              ArrowModal={ArrowModal}
              driverTreeObj={driverTreeObj}
              opacity={opacity}
              recordLockState={recordLockState}
              tableState={tableState}
              viewArrows={viewArrows}
              viewId={viewId}
            />
          ) : null}
        </Xwrapper>
      </Row>
      <Modal show={show} size="sm">
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>Connect to:</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            id="driver"
            onClick={handleSelect}
            style={{ position: "absolute", left: "25px" }}
          >
            Driver
          </Button>
          <Button
            variant="primary"
            id="cluster"
            onClick={handleSelect}
            tyle={{ position: "absolute", right: "25px" }}
          >
            Cluster
          </Button>
        </Modal.Footer>
      </Modal>

      {/* for creating a cluster */}
      <Modal
        name="clusterModal"
        show={showClusterModal}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setShowClusterModal(false)}
        // className={styles.cluster_modal}
      >
        <Modal.Header closeButton>
          <Modal.Title id="cluster-mod-modal">Card Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*give three buttons, one button adds the card to the clsuter Array, one button removes the card from it's cluster, the other card gets out of the menu*/}
          <div style={{ display: "flex" }}>
            {clusterArray.length === 1 ? (
              <Button
                variant="primary"
                className={styles.my_btn}
                onClick={() => removeCluster()}
              >
                Remove From Cluster
              </Button>
            ) : (
              <Button
                variant="success"
                className={styles.my_btn}
                onClick={() => addToThisCluster()}
              >
                Add Cards To This Cluster
              </Button>
            )}
            <Button
              variant="secondary"
              className={styles.my_btn}
              onClick={() => setShowClusterModal(false)}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        name="clusterModal"
        show={createDriverModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setCreateDriverModal(false)}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <DriverModal
            setDriverTreeObj={setDriverTreeObj}
            selOutcome={selOutcome}
            setCreateDriverModal={setCreateDriverModal}
            driverTier={driverTier}
            state={state}
          />
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Body>
      </Modal>

      <Modal
        name="tierModal"
        show={tierModal}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setTierModal(false)}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <TierModal clusterArray={clusterArray} setTierModal={setTierModal} />
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Body>
      </Modal>

      <Modal
        show={connectionShow}
        size="md"
        onHide={() => setConnectionShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>Arrow Options</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            id="addToView"
            onClick={addArrowToView}
            style={{ position: "absolute", left: "25px" }}
          >
            Add / Remove Arrow To View?
          </Button>
          <Button
            variant="primary"
            id="modifyArrow"
            onClick={() => [setArrowMod(true), setConnectionShow(false)]}
            tyle={{ position: "absolute", right: "25px" }}
          >
            Modify Arrow Properties?
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        name="arrowModModal"
        show={showArrowMod}
        size="md"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setArrowMod(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="arrow-modal">Mod Arrow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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

export default DriverCards;
