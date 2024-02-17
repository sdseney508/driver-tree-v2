import React, { useEffect, useState } from "react";
import { Button, Row, Form } from "react-bootstrap";
import styles from "./ClusterModal.module.css";
import { deleteArrow, getArrow, updateArrow } from "../utils/arrows";
import { getOutcome } from "../utils/drivers";

const ModArrows = ({
  arrowID,
  setArrowMod,
  selOutcome,
  setSelOutcome,
}) => {
  const [arrowProps, setArrowProps] = useState({});

  useEffect(() => {
    debugger;
    async function fetchArrow() {
      await getArrow(arrowID).then((res) => {
        setArrowProps(res.data);
      });
    }

    fetchArrow();
  }, [arrowID]);

  //takes the arrowProps from the modal and sets them to the arrowProps state
  async function afterSubmission() {
    let body = arrowProps;
    await updateArrow(arrowID, body);
    getOutcome(selOutcome.id).then((res) => {
      setSelOutcome(res.data);
    });
    setArrowMod(false);
  }

  async function delArrow() {
    await deleteArrow(arrowID);
    getOutcome(selOutcome.id).then((res) => {
      setSelOutcome(res.data);
    });
    setArrowMod(false);
  }

  return (
    <>
      <div className={styles.modal_h}>
        <Row className={styles.my_row}>
          <h5>Arrow Elements</h5>
        </Row>

        <Row className={styles.my_row}>
          <Form>
            <Form.Group controlId="formBasicColor">
              <Form.Label>Color</Form.Label>
              <Form.Select
                aria-label="ArrowColor"
                defaultValue="Select An Arrow Color"
                onChange={(e) => {
                  setArrowProps({ ...arrowProps, color: e.target.value });
                }}
              >
                                <option key={"c1"} value="0">
                  Select an arrow color
                </option>
                <option key={"c2"} value="black">Black</option>
                <option key={"c3"} value="blue">Blue</option>
                <option key={"c4"} value="green">Green</option>
                <option key={"c5"} value="red">Red</option>
              </Form.Select>

              <Form.Label>Start Anchor Location</Form.Label>
              <Form.Select
                aria-label="Start Anchor Looation"
                onChange={(e) => {
                  setArrowProps({
                    ...arrowProps,
                    startAnchor: {
                      position: e.target.value,
                      offset: arrowProps.startAnchor.offset,
                    },
                  });
                }}
              >
                <option key={"s0"} value="0">
                  Select a start anchor
                </option>
                <option key={"s1"} value="left">
                  Left
                </option>
                <option key={"s2"} value="right">
                  Right
                </option>
                <option key={"s3"} value="top">
                  Top
                </option>
                <option key={"s4"} value="bottom">
                  Bottom
                </option>
              </Form.Select>

              <Form.Label>Start Anchor Offset</Form.Label>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => {
                  if (
                    arrowProps.startAnchor.position === "left" ||
                    arrowProps.startAnchor.position === "right"
                  ) {
                    setArrowProps({
                      ...arrowProps,
                      startAnchor: {
                        position: arrowProps.startAnchor.position,
                        offset: { y: parseInt(e.target.value) },
                      },
                    });
                  } else {
                    setArrowProps({
                      ...arrowProps,
                      startAnchor: {
                        position: arrowProps.startAnchor.position,
                        offset: { x: parseInt(e.target.value) },
                      },
                    });
                  }
                }}
              >
                <option value="null">
                  Select an offset (positive is up and left)
                </option>
                <option key={'sOff-30'}  value="30">-30</option>
                <option key={'sOff-20'}  value="20">-20</option>
                <option key={'sOff-10'}  value="10">-10</option>
                <option key={'sOff-0'}  value="0">0</option>
                <option key={'sOff+10'}  value="-10">10</option>
                <option key={'sOff+20'}  value="-20">20</option>
                <option key={'sOff+30'}  value="-30">30</option>
              </Form.Select>

              <Form.Label>End Anchor Location</Form.Label>
              <Form.Select
                aria-label="End Anchor Location"
                onChange={(e) => {
                  setArrowProps({
                    ...arrowProps,
                    endAnchor: {
                      position: e.target.value,
                      offset: arrowProps.endAnchor.offset,
                    },
                  });
                }}
              >
                <option key={"e0"} value="0">
                  Select an End Anchor
                </option>
                <option key={"e1"} value="left">
                  Left
                </option>
                <option key={"e2"} value="right">
                  Right
                </option>
                <option key={"e3"} value="bottom">
                  Bottom
                </option>
                <option key={"e4"} value="top">
                  Top
                </option>
              </Form.Select>

              <Form.Label>Arrow End Point Offset</Form.Label>
              <Form.Select
                aria-label="End Point Offset"
                onChange={(e) => {
                  if (
                    arrowProps.endAnchor.position === "left" ||
                    arrowProps.endAnchor.position === "right"
                  ) {
                    setArrowProps({
                      ...arrowProps,
                      endAnchor: {
                        position: arrowProps.endAnchor.position,
                        offset: { y: parseInt(e.target.value) },
                      },
                    });
                  } else {
                    setArrowProps({
                      ...arrowProps,
                      endAnchor: {
                        position: arrowProps.endAnchor.position,
                        offset: { x: parseInt(e.target.value) },
                      },
                    });
                  }
                }}
              >
                <option value="null">
                  Select an offset (positive is up and left)
                </option>
                <option key={'eOff-30'} value="30">-30</option>
                <option key={'eOff-20'} value="20">-20</option>
                <option key={'eOff-10'} value="10">-10</option>
                <option key={'eOff-0'} value="0">0</option>
                <option key={'eOff+10'} value="-10">10</option>
                <option key={'eOff+20'} value="-20">20</option>
                <option key={'eOff+30'} value="-30">30</option>
              </Form.Select>

              <Form.Label>Turn Distance</Form.Label>
              <Form.Select
                aria-label="Turn Distance"
                onChange={(e) => {
                  console.log(e.target.value);
                  if (arrowProps.dashness === true && arrowProps.endAnchor.position === "right" && arrowProps.startAnchor.position === "right") {
                    let gbreak =  -1*e.target.value.slice(0, -1);
                    setArrowProps({
                      ...arrowProps,
                      dashness: arrowProps.dashness,
                      gridBreak: gbreak,
                    });
                  } else if (arrowProps.dashness === true && arrowProps.endAnchor.position === "left" && arrowProps.startAnchor.position === "left") {
                    let gbreak =  e.target.value.slice(0, -1);
                    setArrowProps({
                      ...arrowProps,
                      dashness: arrowProps.dashness,
                      gridBreak: gbreak,
                    });
                  } else {
                    setArrowProps({
                      ...arrowProps,
                      gridBreak: e.target.value,
                    });
                  }
                }}
              >
                <option value="null">Select turn distance</option>
                {/* the values are inverted here as this is opposite the Anchor Offset */}
                <option key={"t-10"} value="10%">
                  10%
                </option>
                <option key={"t-20"} value="20%">
                  20%
                </option>
                <option key={"t-30"} value="30%">
                  30%
                </option>
                <option key={"t-40"} value="40%">
                  40%
                </option>
                <option key={"t-50"} value="50%">
                  50%
                </option>
                <option key={"t-60"} value="60%">
                  60%
                </option>
                <option key={"t-70"} value="70%">
                  70%
                </option>
                <option key={"t-80"} value="80%">
                  80%
                </option>
                <option key={"t-90"} value="90%">
                  90%
                </option>
              </Form.Select>

              <Form.Check
                type="checkbox"
                label="Dashed"
                onChange={(e) => {
                  setArrowProps({ ...arrowProps, dashness: e.target.checked });
                }}
              />
            </Form.Group>
          </Form>
        </Row>

        <Button onClick={afterSubmission} variant="primary" className="m-1">
          Make Changes
        </Button>

        <Button onClick={delArrow} variant="primary" className="m-1">
          Delete Arrow
        </Button>
      </div>
    </>
  );
};

export default ModArrows;
