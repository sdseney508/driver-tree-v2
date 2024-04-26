import React, { useState} from "react";
import { Button, Row } from "react-bootstrap";
import { createDriver } from "../utils/drivers";
import {addOutcomeDriver} from "../utils/outcomeDrivers";
import DriversImportTable from "./DriversImportTable";
import styles from "./ClusterModal.module.css";
import { getDriverByOutcome } from "../utils/drivers";

const DriverModal = ({
  setDriverTreeObj,
  selOutcome,
  setCreateDriverModal,
  driverTier,
  state,
}) => {
  const [selectedDriver, setSelectedDriver] = useState([]);
  //gives the user the option to either create a new blank driver or import an existing driver from the driver table into the outcome

  const makeNewDriver = async() => {
    let body = {outcomeId: selOutcome.id, tierLevel: driverTier};
    await createDriver(body, state.userId);
    getDriverByOutcome(selOutcome.id).then((data) => {
      setDriverTreeObj(data.data);
    });
    setCreateDriverModal(false);
  }

  const importDriver = async() => {
    debugger;
    let body = {outcomeId: selOutcome.id, driverId: selectedDriver.id, tierLevel: driverTier, userId: state.userId};
    await addOutcomeDriver(body);
    await getDriverByOutcome(selOutcome.id).then((data) => {
      setDriverTreeObj(data.data);
    });

    setCreateDriverModal(false);
  }

  return (
    <>
      <div className={styles.modal_h}>
        <h2>Create / Import Driver</h2>
      </div>
 
        <div>
          <Row style={{ height: "400px" }}>
            <DriversImportTable
              selOutcome={selOutcome}
              selelectedDriver={selectedDriver}
              setSelectedDriver={setSelectedDriver}
            />
          </Row>

          <Button
            variant="primary"
            onClick={makeNewDriver}
            style={{ marginRight: "10px" }}
          >
            Create New Driver
          </Button>

          <Button
            variant="primary"
            onClick={importDriver}
            disabled={selectedDriver.length === 0}
          >
            Import / Use Selected Driver
          </Button>
          <div style={{ height: "10px" }}></div>
        </div>
    </>
  );
};

export default DriverModal;
