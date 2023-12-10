import React, { useEffect, useState } from "react";
import Xarrow from "react-xarrows";
import { getArrows } from "../utils/arrows";

function DriverArrows({
  // arrows, 
  // setArrows,
  driverTreeObj,
  ArrowModal,
  selOutcome,
  viewId,
  opacity,
  viewArrows,
  tableState,
  setViewArrows
}) {
  //rerenders the arrows on selOutcome change
  const [arrows, setArrows] = useState([]);

  useEffect(() => {
    //get the arrows from the database
    async function fetchData() {
      await getArrows(selOutcome.id).then((data)=> {
        setArrows(data.data);
      });
    }
    fetchData();
  }, [driverTreeObj]);


    //this function maps each arrow in the arrows array to a Xarrow component
  const arrowFunc = () => {
    return arrows.map((f, index) => {
      //see if the arrow is in the view, 
      let opVal = 1;
      let viewCheck;
      if (viewArrows) {viewCheck = viewArrows.findIndex((v) => v.arrowId == arrows[index].id);}
      //set initial condition for opacity
      if (viewCheck === -1 && viewId) {
        opVal = opacity;
      }
      return (
          <Xarrow
            arrowBodyProps={{ style: {opacity: opVal}, onClick: (e) => ArrowModal(e, arrows[index].id, tableState), id: "arrow" + arrows[index].id }}
            arrowHeadProps={{ style: {opacity: opVal}, onClick: (e) => ArrowModal(e, arrows[index].id, tableState), id: "arrowhead" + arrows[index].id }}
            animateDrawing={false}
            key={arrows[index].id}
            divContainerStyle={{position: "relative"}}
            SVGcanvasStyle={{position: "absolute"}}
            SVGcanvasProps={{id: "SVG"+arrows[index].id}}
            color={arrows[index].color}
            dashness={arrows[index].dashness}
            end={arrows[index].end}
            endAnchor={arrows[index].endAnchor}
            gridBreak={arrows[index].gridBreak}
            headSize={4}
            path={arrows[index].path}
            showHead={true}
            start={arrows[index].start}
            startAnchor={arrows[index].startAnchor}
            strokeWidth={arrows[index].strokeWidth}
            zIndex={10}
          />

      );
    });
  };

  return (
    <>
     {arrowFunc()}
    </>
  );
}

export default DriverArrows;
