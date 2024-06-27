import React, { useEffect, useState } from "react";
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
import { updateArrow } from "../utils/arrows";
import { deleteCluster, updateCluster } from "../utils/cluster";
import DriverArrows from "./DrawArrows";
import { CreateAnArrow } from "./ArrowFunction";
import ModArrows from "../components/ModArrows";
import DriverModal from "./DriverrModal";
import { removeOutcomeDriver } from "../utils/outcomeDrivers";

const DriverCards = ({
  arrows,
  setArrows,
  createAnArrow,
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
}) => {
  //This module has four functions:
  //1.  It creates the divs that go into the driver tree columns
  //2.  It creates the individual cards in the correct divs
  //3.  It houses the drag and drop functionality for the cards.  this requires the use of the onDragOver, onDragStart, draggable, and onDrop properties in the divs and cards
  //4.  Draws the correct clusters around the selected drivers based on the cluster field in the drivers table
  //The arrow function is contained in the arrows.js module.  It creates the arrows that connect the cards
  let navigate = useNavigate();
  const [arrowID, setArrowID] = useState("");
  const [selectedElements, setSelectedElements] = useState([]);
  const [show, setShow] = useState(false);
  const [connectionShow, setConnectionShow] = useState(false);
  const [showArrowMod, setArrowMod] = useState(false);
  const [, setArrowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createDriverModal, setCreateDriverModal] = useState(false);
  const [driverTier, setDriverTier] = useState('');

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
    const updateArrows = async () => {
      await getArrows(selOutcome.id).then((data) => {
        setArrows(data.data);
      });
    };
    updateArrows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverTreeObj]);

  useEffect(() => {
    if (driverTreeObj.length > 0) {
      setTimeout(() => {
        setLoading(false);
      }, 250);
    }
  }, [driverTreeObj]);

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
      let clustCheck =0;
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
        let clustCheck=0;
        //this is not the first loop, so we need to look at the updateArr
        for (let j = arrayCounter; j < loopEnd; j++) {
          arrayCounter++;

          //we need to find all the arrows that have the card as a start point
          for (let k = 0; k < arrows.length; k++) {
            //if it is in a cluster, we need to find all the arrows that have the cluster as a start point
            //the below string literal is based on how cluster info is passed to the arrows model.  refer to either the arrows model start or end with a cluster already made for an example or look at driverCards.js tierCards function for naming format.
            //first check driverTreeObj to see if the card is in a cluster
            
            for (let n = 1; n < flatDriverTree.length; n++) {
              if (flatDriverTree[n].driverId == updateArr[j] && clustCheck == 0) {
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
    await updateOutcome(selOutcome.id, outcomeBody);
    let updatedoutcome = await getOutcome(selOutcome.id);
    setSelOutcome(updatedoutcome.data);
    // window.location.reload();
    // // //now update the driver tree object
    // await getDriverByOutcome(selOutcome.id).then((data) => {
    //   setDriverTreeObj(data.data[0]);
    // });
  };

  //used in the Tier cards to create the driver cards for both the regular and the cluser
  const DCards = (cardData, tier, viewCheck) => {
    return (
      <Card
        className={styles.my_card}
        id={"card" + cardData.driverId}
        data-cardid={cardData.driverId}
        data-tier={tier}
        data-cluster={cardData.cluster}
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
        {createAnArrow && !PDFState && !recordLockState ? (
          <FontAwesomeIcon
            className={styles.card_arrow}
            icon={faArrowUp}
            data-cardid={cardData.driverId}
            data-type="driver"
            onClick={(e) => MakeAnArrow(e, cardData, "driver")}
          />
        ) : null}
        <Card.Body className={styles.card_body}>
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
                {!recordLockState ? (
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
                ) : (
                  <div className={styles.my_card_text}>
                    {cardData.problemStatement}
                  </div>
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
                  data-tier={tier}
                  value={cardData.status}
                  className={
                    cardData.status === "Green"
                      ? styles.green_status
                      : cardData.status === "Yellow"
                      ? styles.yellow_status
                      : styles.red_status
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
                      : styles.red_status
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
               onClick={() => goToDriverTree(cardData.embeddedOutcomeId)}/>

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
      "tier" + e.target.dataset.tier + "cluster" + e.target.dataset.cluster;
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

  const useDrag = (e) => {
    if (recordLockState) {
      //kick them out and dont let them drag
      return;
    }
    e.dataTransfer.setData("text", e.target.dataset.cardid);
    e.dataTransfer.setData("type", e.target.id);
    e.dataTransfer.setData("dragStart", e.target.dataset.tier);
  };

  async function drop(e) {
    //on drop, sets the drivers new Tier and subTier as required.  The driver is then updated in the database so it will be placed in its new place on the next render
    if (recordLockState) {
      //kick them out and dont let them drag
      return;
    }
    setLoading(true);
    let aBody = {};
    let dragStart = e.dataTransfer.getData("dragStart");
    let dragEnd = e.target.dataset.tier;
    if (!dragEnd) {
      //they didnt drag it to a valid spot, so just return
      setLoading(false);
      return;
    }

    //now see if there is already a card in that slot, if there is, push that card and all others down a slot. then update the card(s) in the database


    let cardname = e.dataTransfer.getData("type");
    let data = e.dataTransfer.getData("text");
    let body = {
      tierLevel: e.target.dataset.tier,
      subTier: e.target.dataset.subtier,
    };

    await updateOutcomeDriver(selOutcome.id, data, state.userId, body);
    //look through the arrows state to find any arrows with the affected cardid as a start or endpoint then update.
    if (dragStart === dragEnd) {
      //return, no change in tier so no need to change arrow logic and DOM refreshed at bottom
      // window.location.reload();
    } else {
      //The user moved the card up / down a tier, so the arrows need to be updated to reflect the new tier
      //cycle through arrow array and update the arrows as needed
      for (let i = 0; i < arrows.length; i++) {
        //see if the card was the start or end of the arrow
        if (arrows[i].start === cardname) {
          //compare the tiers of the start and end points, the starting card moved up a tier so compare the dropped tier with the end tier then adjust the arrow accordingly
          if (dragEnd === document.getElementById(arrows[i].end).dataset.tier) {
            //make the arrow dashed and use the left attach points since the start and end are on the same tier
            aBody.start = arrows[i].start;
            aBody.end = arrows[i].end;
            aBody.dashness = true;
            aBody.startAnchor = { position: "left", offset: { y: 0 } };
            aBody.endAnchor = { position: "left", offset: { y: 0 } };
            aBody.gridBreak = "30%";
          } else if (
            dragEnd > document.getElementById(arrows[i].end).dataset.tier
          ) {
            //make the arrow normal and use the left attach points
            aBody.start = arrows[i].start;
            aBody.end = arrows[i].end;
            aBody.dashness = false;
            aBody.startAnchor = { position: "left", offset: { y: 0 } };
            aBody.endAnchor = { position: "right", offset: { y: 0 } };
            aBody.gridBreak = "50%"; //reset this in case the arrow was previously dashed
          } else {
            //make the arrow normal and use the right attach points but swap the start and end cards
            aBody.start = arrows[i].end;
            aBody.end = arrows[i].start;
            aBody.dashness = false;
            aBody.startAnchor = { position: "left", offset: { y: 0 } };
            aBody.endAnchor = { position: "right", offset: { y: 0 } };
            aBody.gridBreak = "50%"; //reset this in case the arrow was previously dashed
          }
        } else if (arrows[i].end === cardname) {
          //the end card was moved so compare the dropped tier with the start tier then adjust the arrow accordingly
          if (
            dragEnd === document.getElementById(arrows[i].start).dataset.tier
          ) {
            //make the arrow dashed and use the left attach points
            aBody.start = arrows[i].start;
            aBody.end = arrows[i].end;
            aBody.dashness = true;
            aBody.startAnchor = { position: "left", offset: { y: 0 } };
            aBody.endAnchor = { position: "left", offset: { y: 0 } };
            aBody.gridBreak = "50%";
          } else if (
            dragEnd > document.getElementById(arrows[i].start).dataset.tier
          ) {
            //make the arrow normal and use the left attach points
            aBody.start = arrows[i].end;
            aBody.end = arrows[i].start;
            aBody.dashness = false;
            aBody.startAnchor = { position: "left", offset: { y: 0 } };
            aBody.endAnchor = { position: "right", offset: { y: 0 } };
            aBody.gridBreak = "50%"; //reset this in case the arrow was previously dashed
          } else {
            //make the arrow normal and use the left attach points
            aBody.start = arrows[i].start;
            aBody.end = arrows[i].end;
            aBody.dashness = false;
            aBody.startAnchor = { position: "left", offset: { y: 0 } };
            aBody.endAnchor = { position: "right", offset: { y: 0 } };
            aBody.gridBreak = "50%"; //reset this in case the arrow was previously dashed
          }

          //now update the arrow then go onto the next arrow.
        }
        if (aBody.start) {
          await updateArrow(arrows[i].id, aBody);
          getArrows(selOutcome.id).then((data) => {
            setArrows(data.data);
          });
          aBody = {};
        }
      }
    }

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

  const goToDriver = async (e) => {
    e.preventDefault();
    navigate("/drpage/" + selOutcome.id + "/" + e.target.dataset.cardid);
  };

  //used to handle the submit of the modals for clusters and arrows
  const onModalSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };

  //close the modal
  const handleClose = () => {
    setArrowModal(false);
    setArrowMod(false);
    setCreateDriverModal(false);
  };

  const handleSelOutcomeChange = (e) => {
    e.preventDefault();
    let body = { [e.target.name]: e.target.value, userId: state.userId};
    updateOutcome(e.target.dataset.cardid, body);
    getOutcome(selOutcome.id).then((data) => {
      setSelOutcome(data.data);
    });
  };

  const handleClusterChange = (e) => {
    let body = { [e.target.name]: e.target.value };
    updateCluster(e.target.dataset.clusterid, body);
  };

  const goToDriverTree = (embeddedOutcomeId) => {
    //goes to the embedded drivertree; the outcome idea is the outcomeId of the target
    setSelOutcome({ id: embeddedOutcomeId });
    // navigate("/drivertree/" + embeddedOutcomeId);
    // window.location.reload();
  }

  const goToOutcome = async (e) => {
    navigate("/allOutcomes/" + selOutcome.id);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (recordLockState) {
      //kick them out and dont let them drag
      return;
    }
    let body = { [e.target.name]: e.target.value };
    if (e.target.name === "status") {
      //if the user changes the status, then ask if they want to update all the future cards in the driver chain's statust, if yes, then execute cascadeUpdate
      let sures = window.confirm(
        "Do you want to update all future cards in this driver chain to this status?  This will also change the status of any cards in a future cluster if this card is a driver of the entire cluster."
      );
      if (sures) {
        await cascadeUpdate(
          arrows,
          e.target.dataset.cardid,
          e.target.dataset.tier,
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

  //uses the CreateArrow function to make an arrow between two cards
  const MakeAnArrow = async (e, cardid, type) => {
    e.preventDefault();
    setSelectedElements([...selectedElements, cardid]);
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

  const createNewDriver = async (e) => {
    e.preventDefault();
    setDriverTier(e.target.dataset.tier);
    setCreateDriverModal(true);
  }

  function tierButtons(tier) {
    if (state.userRole !== "Stakeholder") {
      return (
        <Button className={styles.my_btn} data-tier={`${tier}`} onClick={(e)=>createNewDriver(e)}>
          +
        </Button>
      );
    }
  }

  function tierCards(tier, driverTreeObj, {viewObj }) {
    let viewCheck;
    const arr = []; //just an empty arr that will be filled with driverTreeObj
    let clusterNumber = 0; //this is just used to see how far to expand a cluster
    let clusterName; //doing it this way to so i dont need the logic when dealing with the first element of the array.
    if (!driverTreeObj) {
      return <div></div>;
    } else {
      //find max number of droppable divs needed for any given tier, then size the columns accordingly.  This will let the columns grow with each tier
      let max = 20;
      for (let i = 0; i < driverTreeObj.length; i++) {
        //now get the number of elements in the driverTreeObj and set the max equal to it plus 1
        if (driverTreeObj[i].subTier >= max) {
          max = driverTreeObj[i].subTier + 1;
        }
      }
      for (let i = 0; i < max; i++) {
        //needs a nested loop for those instances when the driverTreeObj is smaller than 30

        // logic as follows:  insert a placeholder row, then check to see if there should be a card or a cluster, if yes, pop that row and insert card
        arr.push("skip");
        for (let j = 0; j < driverTreeObj.length; j++) {
          let t = i + 1; //the subtiers for the users start at 1 not 0
          if (
            driverTreeObj[j].tierLevel === tier &&
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
              data-tier={tier} //this is used by the update arrows logic to compare the ending and starting div of a drag and if an arrow needs to be updated.
              data-subtier={index + 1}
              id={"tier1subTier" + (index + 1)}
              onDragOver={allowDrop}
              onDrop={drop}
              key={`${tier}div${index + 1}`}
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
          clusterName = arr[index].cluster.clusterName; //update to the current
          let objCheck = [];

          objCheck = driverTreeObj.filter(
            (item) => item.clusterId === clusterNumber
          );
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
              index++;
            } else {
              j = arr.length;
              index++;
            }
          }

          return (
            <div
              className={styles.my_cluster}
              data-tier={tier}
              style={
                // eslint-disable-next-line eqeqeq
                clusterViewCheck != -1 ? { opacity: 1 } : { opacity: opacity }
              }
              data-subtier={index + 1}
              key={`${tier}cluster${clusterNumber}`}
              data-cluster={clusterNumber} //this is the clusterId for cluster updates
              id={`tier${tier}cluster` + clusterNumber} //this is used for the arrow start and end points
              onClick={delCluster}
            >
              {/* text input for clusterName */}
              {!recordLockState ? (
                <Form style={{alignContent: 'center'}}>
                  <Form.Control
                    size="sm"
                    type="text"
                    data-clusterid={clusterNumber}
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
                    (item) => item.driverId == clusterArr[ind].outcomeDrivers.driverId
                  );
                } else {
                  viewCheck = -1;
                }

                return DCards(clusterArr[ind], tier, viewCheck);
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
              data-tier={tier}
              data-subtier={index + 1}
              id={"tier1subTier" + (index + 1)}
              onDragOver={allowDrop}
              onDrop={drop}
              key={`${tier}div${index + 1}`}
            >
              {DCards(arr[index], tier, viewCheck)}
            </div>
          );
        }
      });
    }
  }

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
                    >
                      Red
                    </option>
                  </Form.Control>
                </Form>
                {createAnArrow && !PDFState ? (
                  <FontAwesomeIcon
                    className={styles.card_arrow}
                    icon={faArrowUp}
                    data-cardid={selOutcome.id}
                    data-type="outcome"
                    onClick={(e) => MakeAnArrow(e, selOutcome, "outcome")}
                  />
                ) : null}
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
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Row style={{ minHeight: "500px", width: "100%" }}>
                <br />
                <br />
                {!loading ? (
                  <Legend
                    driverTreeObj={driverTreeObj}
                    selOutcome={selOutcome}
                    recordLockState={recordLockState}
                    state={state}
                  />
                ) : null}
              </Row>
            </Row>
          </Col>
         {!loading ? (<><Col className={styles.driver} key="1">
            <Row>Tier 1 Drivers {tierButtons(1)}</Row>
            <Row id={`tier1Cards`} key={`tier1Cards`} className={styles.my_row}>
              {tierCards(1,  driverTreeObj[1], {viewObj })}
            </Row>
          </Col>
          <Col className={styles.driver} key="2">
            <Row>Tier 2 Drivers {tierButtons(2)}</Row>
            <Row id={`tier2Cards`} key={`tier2Cards`} className={styles.my_row}>
              {tierCards(2, driverTreeObj[2], {viewObj })}
            </Row>
          </Col>
          <Col className={styles.driver} key="3">
            <Row>Tier 3 Drivers{tierButtons(3)}</Row>
            <Row id={`tier3Cards`} key={`tier3Cards`} className={styles.my_row}>
              {tierCards(3,  driverTreeObj[3], {viewObj })}
            </Row>
          </Col>
          <Col className={styles.driver} key="4">
            <Row>Tier 4 Drivers {tierButtons(4)}</Row>
            <Row id={`tier4Cards`} key={`tier4Cards`} className={styles.my_row}>
              {tierCards(4,driverTreeObj[4], {viewObj })}
            </Row>
          </Col>
          <Col className={styles.driver} key="5">
            <Row>Tier 5 Drivers {tierButtons(5)}</Row>
            <Row id={`tier5Cards`} key={`tier5Cards`} className={styles.my_row}>
              {tierCards(5,  driverTreeObj[5], {viewObj })}
            </Row>
          </Col>
          <Col className={styles.driver} key="6">
            <Row>Tier 6 Drivers {tierButtons(6)}</Row>
            <Row id={`tier5Cards`} key={`tier5Cards`} className={styles.my_row}>
              {tierCards(6,  driverTreeObj[6], {viewObj })}
            </Row>

          </Col></>): null}
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
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {/*change everything in the signup form components*/}
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

      <Modal show={connectionShow} size="md" onHide={()=> setConnectionShow(false)}>
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

export default DriverCards;
