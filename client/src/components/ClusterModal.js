import React, { useState} from "react";
import { Button, Row } from "react-bootstrap";
import ClusterTable from "./ClusterTable";
import styles from "./ClusterModal.module.css";
import { createCluster } from "../utils/cluster";
import { getOutcome } from "../utils/drivers";

const ClusterModal = ({
  selDriver,
  setClusterModal,
  setSelDriver,
  selOutcome,
  setSelOutcome,
  state
}) => {
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  //creates a cluster from the selected drivers. 
  //New logic:  create a new cluster in the cluster model, this will then append the clusterId to the driver model.  This will allow for the cluster to be updated and deleted without having to update the driver model.
  const makeCluster = async() => {
    for (let i = 0; i < selectedDrivers.length - 1; i++) {
      if (selectedDrivers[i].tierLevel !== selectedDrivers[i + 1].tierLevel) {
        alert("Drivers must be in the same tier");
        return;
      }
    }
    let body = {outcomeId: selOutcome.id, selDriversArr: selectedDrivers, userId: state.userId, clusterName: "For Test"};
    await createCluster(body);
    //update the selected drivers with the clusterId
    await getOutcome(selOutcome.id).then((data) => {
      setSelOutcome(data.data);
    });
    window.location.reload();
    setClusterModal(false);
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
            onClick={makeCluster}
            disabled={selectedDrivers.length < 1}
          >
            Create
          </Button>
          <div style={{ height: "10px" }}></div>
        </div>
    </>
  );
};

export default ClusterModal;
