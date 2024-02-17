import React, { useEffect } from "react";
import Xarrow from "react-xarrows";

function DriverArrows({
  arrows, 
  ArrowModal,
  driverTreeObj,
  opacity,
  recordLockState,
  // setArrows,
  tableState,
  viewArrows,
  viewId,
}) {
  //this function maps each arrow in the arrows array to a Xarrow component
  const arrowFunc = () => {
    return arrows.map((f, index) => {
      //see if the arrow is in the view,
      let opVal = 1;
      let viewCheck;
      if (viewArrows) {
        viewCheck = viewArrows.findIndex((v) => v.arrowId === arrows[index].id);
      }
      //set initial condition for opacity
      if (viewCheck === -1 && viewId) {
        opVal = opacity;
      }
      return (
        <Xarrow
          arrowBodyProps={{
            style: { opacity: opVal },
            onClick: (e) => {if (!recordLockState) {ArrowModal(e, arrows[index].id, tableState)}},
            id: "arrow" + arrows[index].id,
          }}
          arrowHeadProps={{
            style: { opacity: opVal },
            onClick: (e) => {if (!recordLockState) {ArrowModal(e, arrows[index].id, tableState)}},
          }}
          animateDrawing={false}
          animationSpeed={0}
          key={arrows[index].id}
          divContainerStyle={{
            position: "relative",
            animation: "none",
            width: 0, 
            height: 0,
            padding: 0,
            margin: 0,
          }}
          SVGcanvasStyle={{
            position: "relative",
            animation: "none",            
          }}
          SVGcanvasProps={{ id: "SVG" + arrows[index].id }}
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

  return <>{ arrows ? arrowFunc():   null}</>;
}

export default DriverArrows;
