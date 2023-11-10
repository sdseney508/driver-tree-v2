import React, { useEffect, useState } from "react";
import { Button, Row, Form } from "react-bootstrap";
import styles from "./ClusterModal.module.css";
import { deleteArrow, getArrow, updateArrow } from "../utils/arrows";
import { getOutcome } from "../utils/drivers";

const ModArrows = ({
  onModalSubmit,
  arrowID,
  setArrowMod,
  selOutcome,
  setSelOutcome,
}) => {
  const [arrowProps, setArrowProps] = useState({});


  useEffect(() => {
    async function fetchArrow() {
      await getArrow(arrowID).then((res) => {
        setArrowProps(res.data);
      });
    }
    console.log(arrowID);
    fetchArrow();

  }, []);

  //takes the arrowProps from the modal and sets them to the arrowProps state
  async function afterSubmission() {
    console.log(arrowProps.startAnchor.position);
    console.log(arrowProps.endAnchor.position);
    // if (
    //   arrowProps.startAnchor.position === "right" &&
    //   arrowProps.endAnchor.position === "right"
    // ) {
    //   setArrowProps({ ...arrowProps, gridBreak: parseInt(-10) });
    // }


    let body = arrowProps;
    // body.gridBreak = parseInt(-20);
    console.log(body);
    await updateArrow(arrowID, body);
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
            {/* choose a color */}
            <Form.Group controlId="formBasicColor">
              <Form.Label>Color</Form.Label>
              <Form.Select
                aria-label="Default select example"
                defaultValue="Black"
                onChange={(e) => {
                  setArrowProps({ ...arrowProps, color: e.target.value });
                }}
              >
                <option value="black">Black</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
              </Form.Select>

              <Form.Label>Start Anchor Location</Form.Label>
              <Form.Select
                aria-label="Default select example"
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
                defaultValue="0"
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
                  Select an offset (neg is up and left)
                </option>
                <option value="-30">-30</option>
                <option value="-20">-20</option>
                <option value="-10">-10</option>
                <option value="0">0</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="-30">30</option>
              </Form.Select>

              <Form.Label>End Anchor Location</Form.Label>
              <Form.Select
                aria-label="Default select example"
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
                  Select and end anchor
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

              <Form.Label>Arrow Offset</Form.Label>
              <Form.Select
                aria-label="Default select example"
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
                  Select an offset (neg is up and left)
                </option>
                <option value="-30">-30</option>
                <option value="-20">-20</option>
                <option value="-10">-10</option>
                <option value="0">0</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </Form.Select>

              <Form.Label>Turn Distance</Form.Label>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => {
 
                    setArrowProps({
                      ...arrowProps,
                      gridBreak: parseInt(e.target.value)
                    });
                  }
                }
              >
                <option value="null">
                  Select turn distance
                </option>
                <option key={"t-30"} value="-30">-30</option>
                <option key={"t-20"} value="-20">-20</option>
                <option key={"t-10"} value="-10">-10</option>
                <option key={"t-0"} value="0">0</option>
                <option key={"t+10"} value="10">10</option>
                <option key={"t+20"} value="20">20</option>
                <option key={"t+30"} value="30">30</option>
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
