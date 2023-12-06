import { createArrow } from "../utils/arrows";
import { getOutcome } from "../utils/drivers";

const CreateAnArrow = async ({
  selectedElements,
  selOutcome,
  setSelOutcome,
}) => {
    let body = {};
    body.outcomeId = selOutcome.id;
    if (
      !selectedElements[0].outcomeTitle &&
      !selectedElements[1].outcomeTitle
    ) {
      
      //both are drivers, now we put in the logic for where the arrow goes
      if (selectedElements[0].tierLevel > selectedElements[1].tierLevel) {
        //assume the first element is the start; now we check to see if it is a cluster
        if (selectedElements[0].clusterId !== null) {
          body.start =
            `tier${selectedElements[0].tierLevel}cluster` +
            selectedElements[0].clusterId;
          
            //set the start driver id for the arrow for the use in cascading status update feature.  Explanation is in client/src/utils/statusUpdate.js
          body.startDriver = selectedElements[0].id;
  
          //and check for cluster on the beginning card
        } else {
          body.start = `card${selectedElements[0].id}`;
          body.startDriver = selectedElements[0].id;
        }

        //now we check if the end point is a cluster
        if (selectedElements[1].clusterId !== null) {
          //should start on the cluster
          body.end =
            `tier${selectedElements[1].tierLevel}cluster` +
            selectedElements[1].clusterId;
        } else {
          body.end = `card${selectedElements[1].id}`;
        }

      } else {
        //they selected cards in the wrong order, so switch them
        if (selectedElements[1].clusterId !== null) {
          body.start =
            `tier${selectedElements[1].tierLevel}cluster` +
            selectedElements[1].clusterId;
  
          //and check for cluster on the beginning card
        } else {
          body.start = `card${selectedElements[1].id}`;
        }

        //now we check if the end point is a cluster
        if (selectedElements[0].clusterId !== null) {
          //should start on the cluster
          body.end =
            `tier${selectedElements[0].tierLevel}cluster` +
            selectedElements[0].clusterId;
        } else {
          body.end = `card${selectedElements[0].id}`;
        }
      }

     
    } else {
      console.log("one is an outcome")
      //one is the outcome, find which one and make it the arrow end
      if (selectedElements[0].outcomeTitle) {
        body.end = `outcomeId${selectedElements[0].id}`;
        //now check to see if the other arrow comes out of a cluster or driver
        if (selectedElements[1].clusterId === null) {
          body.start = `card${selectedElements[1].id}`;
        } else {
          body.start =
            `tier${selectedElements[1].tierLevel}cluster` +
            selectedElements[1].clusterId;
        }
      } else {
        body.end = `outcomeId${selectedElements[1].id}`;
        if (!selectedElements[0].clusterId) {
          body.start = `card${selectedElements[0].id}`;
        } else {
          body.start =
            `tier${selectedElements[0].tierLevel}cluster` +
            selectedElements[0].clusterId;
        }
      }
    }

    if (selectedElements[0].tierLevel === selectedElements[1].tierLevel) {
      body.startAnchor = {position: "left", offset: {y: 0}};
      body.endAnchor = {position: "left", offset: {y: 0}};
      body.dashness = "true";
      body.gridBreak = "30";
    } else {
      body.startAnchor = {position: "left", offset: {y: 0}};
      body.endAnchor = {position: "right", offset: {y: 0}};
    }
    console.log("body", body);
     await createArrow(body);
      getOutcome(selOutcome.id).then((res) => {
        setSelOutcome(res.data);
      });
};

export {CreateAnArrow};
