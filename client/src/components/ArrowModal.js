import React, { useState } from "react";
import { Button, Row } from "react-bootstrap";
import ArrowTable from "./ArrowTable";
import styles from "./ClusterModal.module.css";

import { createArrow } from "../utils/arrows";
import { getOutcome } from "../utils/drivers";

const ArrowModal = ({
  onModalSubmit,
  selDriver,
  setSelDriver,
  selOutcome,
  setSelOutcome,
  setArrowMod,
}) => {
  const [selectedElements, setSelectedElements] = useState([]);

  async function createAnArrow() {
    debugger;
    let body = {};
    body.outcomeID = selOutcome.id;
    body.outcomeId = selOutcome.id;
    body.passProps = "onClick={setArrowMod(true)}";

    if (
      !selectedElements[0].outcomeTitle &&
      !selectedElements[1].outcomeTitle
    ) {
      //both are drivers
      if (selectedElements[0].tierLevel > selectedElements[1].tierLevel) {
        body.start = `card${selectedElements[0].id}`;
        body.end = `card${selectedElements[1].id}`;
      } else {
      body.start = `card${selectedElements[1].id}`;
      body.end = `card${selectedElements[0].id}`;
      }
      console.log(body);
      //now check for cluster on the end card
      if (selectedElements[0].cluster !== 0) {
        body.end =
          `tier${selectedElements[0].tierLevel}cluster` +
          selectedElements[0].cluster;
        //and check for cluster on the beginning card
      } else if (selectedElements[1].cluster !== 0) {
        body.start =
          `tier${selectedElements[1].tierLevel}cluster` +
          selectedElements[1].cluster;
      }
    } else {
      //one is the outcome, find which one and make it the arrow end
      if (selectedElements[0].outcomeTitle) {
        body.end = `outcomeID${selectedElements[0].id}`;
        //now check to see if the other arrow comes out of a cluster or driver
        if (selectedElements[1].cluster === 0) {
          body.start = `card${selectedElements[1].id}`;
        } else {
          body.start =
            `tier${selectedElements[1].tierLevel}cluster` +
            selectedElements[1].cluster;
        }
      } else {
        body.end = `outcomeID${selectedElements[1].id}`;
        if (selectedElements[0].cluster === 0) {
          body.start = `card${selectedElements[0].id}`;
        } else {
          body.start =
            `tier${selectedElements[0].tierLevel}cluster` +
            selectedElements[0].cluster;
        }
      }
    }

    if (selectedElements[0].tierLevel === selectedElements[1].tierLevel) {
      body.startAnchor = "left";
      body.endAnchor = "left";
      body.dashness = "true";
      body.gridBreak = "10";
    } else {
      body.startAnchor = "left";
      body.endAnchor = "right";
    }
     await createArrow(body);
      getOutcome(selOutcome.id).then((res) => {
        setSelOutcome(res.data);
      });
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <div className={styles.modal_h}>
        <h2>Connectable Elements</h2>
      </div>

      <div>
        <Row style={{ height: "400px" }}>
          <ArrowTable
            selDriver={selDriver}
            setSelDriver={setSelDriver}
            selOutcome={selOutcome}
            setSelOutcome={setSelOutcome}
            selectedElements={selectedElements}
            setSelectedElements={setSelectedElements}
          />
        </Row>

        <Button
          variant="primary"
          onClick={createAnArrow}
          disabled={selectedElements.length < 2}
        >
          Create
        </Button>
        <div style={{ height: "10px" }}></div>
      </div>
    </>
  );
};

export default ArrowModal;
