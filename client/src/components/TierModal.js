import React, { useState } from "react";
import { Button, Row } from "react-bootstrap";
import styles from "./ClusterModal.module.css";

const TierModal = ({ clusterArray,setTierModal }) => {
  //gives the user the option to either create a new blank driver or import an existing driver from the driver table into the outcome

  //this function returns a button for the tier of the cluster array and the tier number passed into the modal
  const setTier = (key) => {

    for (let i = 0; i < clusterArray.length; i++) {
      if (clusterArray[i].tierLevel !== key) {
        clusterArray[i].tierLevel = key;
      }
    };
    setTierModal(false);

  };

  const tierButtons = (clusterArray) => {
    let buttonArray = [];
    let tier = 0;
    for (let i = 0; i < clusterArray.length; i++) {
      if (clusterArray[i].tierLevel !== tier) {
        buttonArray.push(clusterArray[i].tierLevel);
      }
    }
    return buttonArray.map((tier) => {
      return <Button key={tier} className={styles.my_button} onClick={()=> setTier(tier)}>{tier}</Button>;
    });
  };

  return (
    <>
      <div className={styles.modal_h}>
        <h2>Select Cluster Tier</h2>
      </div>

      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Row>{tierButtons(clusterArray)}</Row>
      </div>
    </>
  );
};

export default TierModal;
