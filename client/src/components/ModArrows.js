import React, { useState, useEffect } from "react";
import { Button, Row, Form } from "react-bootstrap";
import styles from "./ClusterModal.module.css";
import { deleteArrow, updateArrow } from "../utils/arrows";
import { getOutcome } from "../utils/drivers";

const ModArrows = ({ onModalSubmit, arrowID, setArrowMod, selOutcome, setSelOutcome }) => {
  const [selectedElements, setSelectedElements] = useState([]);
  const [arrowProps, setArrowProps] = useState([]);

  //takes the arrowProps from the modal and sets them to the arrowProps state
  async function afterSubmission() {
    let body = arrowProps;
    await updateArrow(arrowID, body);
    setArrowMod(false);
  }

  async function delArrow() {
    console.log(arrowID);
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
                <option value="red">Red</option>
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

        <Button onClick={afterSubmission} variant="primary" className='m-1'>
          Make Changes
        </Button>

        <Button onClick={delArrow} variant="primary" className='m-1'>
          Delete Arrow
        </Button>
      </div>
    </>
  );
};

export default ModArrows;
