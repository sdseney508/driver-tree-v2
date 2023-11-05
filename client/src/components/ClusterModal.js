import React, { useState, useEffect } from "react";
import { Button, Row } from "react-bootstrap";
import ClusterTable from "./ClusterTable";
import styles from "./ClusterModal.module.css";
import { updateDriver } from "../utils/drivers";

const ClusterModal = ({
  onModalSubmit,
  selDriver,
  setSelDriver,
  selOutcome,
  setSelOutcome,
  driverTreeObj,
}) => {
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  useEffect(() => {}, []);

  function createCluster() {
    let clusternumb = 0;
    for (let i = 0; i < selectedDrivers.length - 1; i++) {
      if (selectedDrivers[i].tierLevel !== selectedDrivers[i + 1].tierLevel) {
        alert("Drivers must be in the same tier");
        return;
      }
    }
    for (let i = 0; i < driverTreeObj.length; i++) {
      if (driverTreeObj[i].tierLevel === selectedDrivers[0].tierLevel) {
        if (driverTreeObj[i].cluster > clusternumb) {
          clusternumb = driverTreeObj[i].cluster;
        }
      }
    }
    clusternumb++;
    
    for (let i = 0; i < selectedDrivers.length; i++) {
      const driver = selectedDrivers[i];
      updateDriver(driver.id, { cluster: clusternumb });
    }
    window.location.reload();
  }

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <div className={styles.modal_h}>
        <h2>Cluster Functions</h2>
      </div>
 
        <div>
          <Row style={{ height: "400px" }}>
            <ClusterTable
              selDriver={selDriver}
              setSelDriver={setSelDriver}
              selOutcome={selOutcome}
              setSelOutcome={setSelOutcome}
              selectedDrivers={selectedDrivers}
              setSelectedDrivers={setSelectedDrivers}
            />
          </Row>

          <Button
            variant="primary"
            onClick={createCluster}
            disabled={selectedDrivers.length < 2}
          >
            Create
          </Button>
          <div style={{ height: "10px" }}></div>
        </div>
    </>
  );
};

export default ClusterModal;
